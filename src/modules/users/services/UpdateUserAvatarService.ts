import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpadateUserAvatarService {
  constructor(private usersRepository: IUsersRepository) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }
    // Deletar o avatar
    if (user.avatar) {
      // tras o caminho do imagem do avatar
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // tras o status do arquivo se ele existir
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      if (userAvatarFileExists) {
        // exclui o arquivo
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    // sobrescreve o arquivo do avatar
    user.avatar = avatarFilename;
    // atualiza o User, porque já tem um User instanciado com o id, senão ele cria um novo Users
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpadateUserAvatarService;
