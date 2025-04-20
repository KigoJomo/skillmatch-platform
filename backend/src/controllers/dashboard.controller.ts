import { AppDataSource } from "../data-source";
import { Profile } from "../entities/Profile";

const profileRepository = AppDataSource.getRepository(Profile);
// const jobApplicationRepository

export class DashbboardController {
  // static async 
}