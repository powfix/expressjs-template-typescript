import {sequelize} from "../../models/db-01";
import {StringUtils} from "../../utils/StringUtils";

const start_ts = new Date().getDate();
(async() => {
  await sequelize.getQueryInterface().createDatabase(sequelize.getDatabaseName());
  const end_ts = new Date().getDate();
  console.log(`✅ Create Database ${sequelize.getDatabaseName()} success(${StringUtils.numberWithCommas(end_ts - start_ts)}ms)`);
  process.exit(0);
})();
