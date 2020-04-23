import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/Users';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpadateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

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
    await usersRepository.save(user);

    return user;
  }
}

export default UpadateUserAvatarService;
