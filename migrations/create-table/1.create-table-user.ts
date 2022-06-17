import {User} from "../../models/db-01/User";
import {createTable} from "../../utils/create_table";

const Table = User;

(async() => {
  await createTable(Table).finally(() => process.exit());
})();
