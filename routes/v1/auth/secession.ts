import {Request, Response, Router} from 'express';
import moment from "moment";
import {UuidUtils} from "../../../utils/UuidUtils";
import {UserToken} from "../../../models/db-01/UserToken";
import {Type} from "../../../constants/user";

const router = Router();
router.post('/', (req: Request, res: Response) => {
  // @ts-ignore
  req.fetchReqUser({}).then((reqUser: any) => {
    if (!reqUser) return res.sendStatus(404);
    if (reqUser?.deleted_at) {
      console.warn('Already deleted user', reqUser);
      return res.sendStatus(404);
    }

    if (reqUser?.type === Type.ADMINISTRATOR) {
      console.warn('최고 관리자는 탈퇴할 수 없습니다');
      return res.sendStatus(400);
    }

    UserToken.destroy({ where: { user_uuid: UuidUtils.toBuffer(reqUser.uuid) } }).then((count) => {
      console.info(count, 'token is deleted');

      reqUser.deleted_at = moment();
      reqUser.save().then(() => {
        return res.sendStatus(200);
      });
    });
  });
});

module.exports = router;
