// import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
// import User from '../infra/typeorm/entities/User';
// import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUsersRepository';
import IUserTokenRepository from '../repositories/IUsersTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokenRepository,
  ) {}

  public async execute({ email, token }: IRequest): Promise<void> {}
}

export default ResetPasswordService;
