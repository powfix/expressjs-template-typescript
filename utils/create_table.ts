import {StringUtils} from './StringUtils'

export const createTable = async(Table: any) => {
  console.log(`======Create ${Table.tableName} Table======`);

  const start_ts = new Date().getTime();
  const {argv} = process;

  // Force sync if (--force or -f) flag in argv
  const force: boolean = argv.includes('--force') || argv.includes('-f');

  if (force) {
    console.info('❗ Force sync activated');
  }

  await Table.sync({force}).then(() => {
    const end_ts = new Date().getTime();
    console.log(`✅ Create Table ${Table.tableName} success(${StringUtils.numberWithCommas(end_ts - start_ts)}ms)`);
  }).catch((err: Error) => {
    console.error(`‼️ Failed to Create ${Table.tableName} Table`, err);
  });
};
