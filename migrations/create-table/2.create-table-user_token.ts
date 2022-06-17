import {createTable} from "../../utils/create_table";
import {UserToken} from "../../models/db-01/UserToken";

const Table = UserToken;

(async() => {
  await createTable(Table).finally(() => process.exit());
})();
