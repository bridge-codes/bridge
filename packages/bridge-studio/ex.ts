import { API } from './sdk';

API.project.compileWithCommandLine({} as any).then((res) => {
  //   if (res.error) {
  //     res.error;
  //   }
  res.data?.project.githubRepo;
});
