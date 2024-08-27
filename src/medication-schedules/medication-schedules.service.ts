import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository, Loaded } from '@mikro-orm/mysql';
import { MedicationSchedule, Status, User } from 'src/app.entities';
import { CreateMedicationScheduleDto } from './dto/medication-schedules.dto';
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
      await this.em.flush();
      return medicationSchedule;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private groupByIntakeTime(
    medicationSchedule: Loaded<MedicationSchedule, never>[],
  ) {
    try {
      const groupedData = medicationSchedule.reduce(
        (groupedObj, medication) => {
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
              name: medication.medicationName,
              strength: medication.strength,
              strengthUnit: medication.strengthUnit,
              isTaken: false,
            });
          }
          console.log(groupedObj);

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
        .createQueryBuilder(MedicationSchedule)
        .select(
          [
            'id',
            'medicationName',
            'frequency',
            'strength',
            'strengthUnit',
            'endDate',
            'intakeTime',
            'intakeType',
            'selectedDays',
            'medicationType',
          ],
          true,
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

  // async reminderPayload(timings: string[]){
  //   try {
  //     const reminderData =
  //   } catch (error) {
  //     throw new HttpException('Unable to parse reminder payload', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
