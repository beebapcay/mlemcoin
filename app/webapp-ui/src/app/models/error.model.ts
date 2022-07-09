import { ErrorMessageConstant } from '../common/error-message.constant';
import { ErrorEnum } from '../enums/error.enum';

export class ErrorModel {
  constructor(
    public code: ErrorEnum = null,
    public message: ErrorMessageConstant = null
  ) {
  }
}

export class PageNotFoundErrorModel extends ErrorModel {
  constructor() {
    super(ErrorEnum.NotFound, ErrorMessageConstant.NotFound);
  }

  public static create(): PageNotFoundErrorModel {
    return new PageNotFoundErrorModel();
  }
}

export class NotSupportedErrorModel extends ErrorModel {
  constructor() {
    super(ErrorEnum.NotSupported, ErrorMessageConstant.NotSupported);
  }

  public static create(): NotSupportedErrorModel {
    return new NotSupportedErrorModel();
  }
}
