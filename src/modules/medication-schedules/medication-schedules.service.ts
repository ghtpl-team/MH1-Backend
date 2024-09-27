import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, Loaded } from '@mikro-orm/mysql';

import {
  CreateMedicationScheduleDto,
  UpdateMedicationScheduleDto,
} from './dto/medication-schedules.dto';
import { capitalizeFirstLetterOfWords } from 'src/common/utils/string.utils';
import {
  MedicationScheduleResponseObj,
  TimeSlot,
} from './medication-schedules.interface';
import { Status } from 'src/entities/base.entity';
import { MedicationSchedule } from 'src/entities/medication-schedule.entity';
import {
  ScheduledTask,
  ScheduledTaskStatus,
} from 'src/entities/scheduled-tasks.entity';
import {
  Schedule,
  ScheduledBy,
  ReminderType,
} from 'src/entities/schedules.entity';
import { MedicationTabIcons } from 'src/constants/medication-schedule.constants';

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
            selectedDays: medicationSchedule?.selectedDays ?? undefined,
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
                rank: TimeSlot[intakeTimeType],
                tabIcon: MedicationTabIcons[intakeTimeType],
                intakeTiming: intakeTimeType,
                schedule: [],
              };
            }

            groupedObj[intakeTimeType].schedule.push({
              id: medication.id,
              name: medication.medicationName,
              strength: medication.strength,
              strengthUnit: medication.strengthUnit,
              intakeTime: medication.intakeTime,
              intakeTimes: medication.intakeTimes,
              ...medication,
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
      return Object.values(groupedData).sort((a, b) => a.rank - b.rank);
    } catch (error) {
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
            'ms.startDate',
            'ms.endDate',
            'ms.intakeTime',
            'ms.intakeTimes',
            'ms.intakeType',
            'ms.selectedDays',
            'ms.medicationType',
          ],
          true,
        )
        .innerJoinAndSelect('ms.schedule', 'sc', { user: userId }, [
          'sc.id',
          'sc.reminderTime',
        ])
        .innerJoinAndSelect(
          'sc.scheduledTasks',
          'st',
          {
            date: {
              $gte: new Date().toISOString().split('T')[0],
            },
            user: userId,
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

      const groupedSchedule = this.groupByIntakeTime(medicationList);

      return groupedSchedule;
    } catch (error) {
      throw error;
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
    return await this.em.nativeUpdate(
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
