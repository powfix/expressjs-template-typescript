import {createTable} from "../../utils/create_table";
import {SignInHistory} from "../../models/db-01/SignInHistory";

const Table = SignInHistory;

(async() => {
  await createTable(Table).finally(() => process.exit());
})();
