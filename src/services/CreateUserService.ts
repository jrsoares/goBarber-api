import { getRepository } from 'typeorm';
import { hash } from 'bcrypt';
import User from '../models/Users';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userReposotiry = getRepository(User);

    // Checo se existe o email cadastrado

    const checkUserExists = await userReposotiry.findOne({
      where: { email },
    });
    if (checkUserExists) {
      throw Error('Email address already used.');
    }

    const hashedPassword = await hash(password, 8);
    const user = userReposotiry.create({
      name,
      email,
      password: hashedPassword,
    });

    await userReposotiry.save(user);
    return user;
  }
}

export default CreateUserService;
