import { HttpException, HttpStatus } from "@nestjs/common";

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new HttpException({
        statusCode: HttpStatus.NOT_ACCEPTABLE,
        message: 'Only Images are allowed !'
      },
      HttpStatus.NOT_ACCEPTABLE), false);
    }
    callback(null, true);
  };