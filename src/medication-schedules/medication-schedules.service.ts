import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, Loaded } from '@mikro-orm/mysql';
import {
  MedicationSchedule,
  ReminderType,
  Schedule,
  ScheduledBy,
  ScheduledTask,
  ScheduledTaskStatus,
  Status,
} from 'src/app.entities';
import {
  CreateMedicationScheduleDto,
  UpdateMedicationScheduleDto,
} from './dto/medication-schedules.dto';
import { capitalizeFirstLetterOfWords } from 'src/common/utils/string.utils';
import { MedicationScheduleResponseObj } from './medication-schedules.interface';

@Injectable()
export class MedicationSchedulesService {
  constructor(
    @InjectRepository(MedicationSchedule)
    private readonly medicationScheduleRepository: EntityRepository<MedicationSchedule>,
    private readonly em: EntityManager,
  ) {}

  async create(
    medicationScheduleData: CreateMedicationScheduleDto,
    userId: number,
  ): Promise<MedicationSchedule> {
    try {
      const medicationSchedule = this.em.create(MedicationSchedule, {
        user: userId,
        ...medicationScheduleData,
      });

      const schedules = medicationScheduleData.intakeTimes.map(
        (medicationTime) => {
          return this.em.create(Schedule, {
            medicationSchedule: medicationSchedule,
            recurrenceRule: medicationSchedule.frequency,
            scheduledBy: ScheduledBy.USER,
            type: ReminderType.MEDICATION_SCHEDULE,
            reminderTime: medicationTime,
            user: userId,
          });
        },
      );

      const scheduledTasks = [];
      if (new Date(medicationSchedule.startDate) <= new Date()) {
        schedules.forEach((schedule) => {
          scheduledTasks.push(
            this.em.create(ScheduledTask, {
              type: ReminderType.MEDICATION_SCHEDULE,
              schedule: schedule,
              user: userId,
            }),
          );
        });
      }
      await this.em.persistAndFlush([
        medicationSchedule,
        ...schedules,
        ...scheduledTasks,
      ]);
      return medicationSchedule;
    } catch (error) {
      console.log(error);

      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private groupByIntakeTime(
    medicationSchedule: Loaded<MedicationSchedule, never>[],
  ) {
    try {
      const groupedData = medicationSchedule.reduce(
        (groupedObj, medication) => {
          let index = 0;
          for (const time of medication.intakeTime) {
            const intakeTimeType = capitalizeFirstLetterOfWords(
              `${medication.intakeType.split('_')[0]} ${time}`,
            );

            if (!groupedObj[intakeTimeType]) {
              groupedObj[intakeTimeType] = {
                intakeTiming: intakeTimeType,
                schedule: [],
              };
            }

            groupedObj[intakeTimeType].schedule.push({
              id: medication.id,
              name: medication.medicationName,
              strength: medication.strength,
              strengthUnit: medication.strengthUnit,
              isTaken:
                medication.schedule[index]?.scheduledTasks[0]?.taskStatus ===
                ScheduledTaskStatus.DONE,
              timing: {
                id: medication.schedule[index].id,
                reminderTime: medication.schedule[index].reminderTime,
                scheduledTaskId:
                  medication.schedule[index].scheduledTasks[0].id,
              },
            });
            index += 1;
          }

          return groupedObj;
        },
        {} as MedicationScheduleResponseObj,
      );
      return Object.values(groupedData);
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  async findAll(userId: number) {
    try {
      const medicationList = await this.em
        .createQueryBuilder(MedicationSchedule, 'ms')
        .select(
          [
            'ms.id',
            'ms.medicationName',
            'ms.frequency',
            'ms.strength',
            'ms.strengthUnit',
            'ms.endDate',
            'ms.intakeTime',
            'ms.intakeType',
            'ms.selectedDays',
            'ms.medicationType',
          ],
          true,
        )
        .leftJoinAndSelect('ms.schedule', 'sc', {}, [
          'sc.id',
          'sc.reminderTime',
        ])
        .leftJoinAndSelect(
          'sc.scheduledTasks',
          'st',
          {
            date: { $gte: new Date().toISOString().split('T')[0] },
          },
          ['st.id', 'st.taskStatus'],
        )
        .where({
          user: {
            id: userId,
          },
          status: Status.ACTIVE,
          endDate: {
            $gte: new Date(),
          },
          startDate: {
            $lte: new Date(),
          },
        });

      console.log(JSON.stringify(medicationList, null, 2));

      const groupedSchedule = this.groupByIntakeTime(medicationList);

      return groupedSchedule;
    } catch (error) {
      throw new HttpException(
        'Something Went Wrong!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // async parseMedicalSchedule(medicalScheduleData: )

  async delete(id: number) {
    try {
      return await this.em
        .createQueryBuilder(MedicationSchedule)
        .update({
          status: Status.DELETED,
        })
        .where({
          id,
        });
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    updateMedicationScheduleDto: UpdateMedicationScheduleDto,
  ) {
    return this.em.nativeUpdate(
      MedicationSchedule,
      {
        id,
      },
      {
        ...updateMedicationScheduleDto,
      },
    );
  }
}
