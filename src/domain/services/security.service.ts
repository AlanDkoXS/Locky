import { CustomError } from '../errors/custom.error';
import { SecurityBox } from '../../data/postgres/models/securityBox.model';
import { Favorite } from '../../data/postgres/models/favorite.model';
import { CreateBoxDTO } from '../dtos/security/create-box.dto';
import { User } from '../../data/postgres/models/user.model';

export class SecurityService {
  async findOne(id: string) {
    const box = await SecurityBox.findOne({
      where: {
        id: id,
      },
    });
    if (!box) {
      throw CustomError.notFoud('Security Box not found');
    }
    return box;
  }

  async createSecurityBox(data: CreateBoxDTO) {
    const securityBox = new SecurityBox();
    securityBox.name = data.name;
    securityBox.favorite = data.favorite;
    securityBox.status = data.status;
    securityBox.icon = data.icon || 'default-icon';

    try {
      return await securityBox.save();
    } catch (error) {
      console.log(error);
      throw CustomError.internalServer('Error creating security box');
    }
  }

  async getSecurityBoxes() {
    try {
      const boxes = await SecurityBox.find({
        where: {
          status: 'active',
        },
      });
      return boxes;
    } catch (error) {
      throw CustomError.internalServer('Error fetching boxes');
    }
  }

  async updateSecurityBox(id: string, data: CreateBoxDTO) {
    console.log('Recibed ID:', id);
    const box = await this.findOne(id);
    if (!box) {
      throw CustomError.notFoud('Security Box not found');
    }

    box.name = data.name;
    box.favorite = data.favorite;
    box.status = data.status;
    box.icon = data.icon || 'default-icon';

    try {
      await box.save();
      return box;
    } catch (error) {
      console.error('Error updating box:', error);
      throw CustomError.internalServer('Error updating box');
    }
  }

  async deleteSecurityBox(id: string) {
    const box = await this.findOne(id);
    if (!box) {
      throw CustomError.notFoud('Security box not found');
    }

    try {
      await box.remove();
    } catch (error) {
      throw CustomError.internalServer('Error deleting security box');
    }
  }

  async toggleFavorite(
    userId: string,
    securityBoxId: string,
    isFavorite: boolean
  ): Promise<{ message: string }> {
    try {
      const securityBox = await SecurityBox.findOne({
        where: { id: securityBoxId },
      });
      if (!securityBox) {
        throw CustomError.notFoud('SecurityBox not found');
      }

      const existingFavorite = await Favorite.findOne({
        where: {
          user: { id: userId },
          securityBox: { id: securityBoxId },
        },
      });

      if (existingFavorite) {
        if (!isFavorite) {
          await existingFavorite.remove();
          return { message: 'SecurityBox removed from favorites' };
        }
      } else if (isFavorite) {
        const favorite = new Favorite();
        favorite.user = { id: userId } as User;
        favorite.securityBox = { id: securityBoxId } as SecurityBox;
        await favorite.save();
        return { message: 'SecurityBox added to favorites' };
      }

      return { message: 'No changes have been made' };
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      throw CustomError.internalServer('Failed to update favorite status');
    }
  }
}
