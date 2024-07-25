export type ActionResponseType = {
  status: ActionResponseStatus;
  message: string;
};

export enum ActionResponseStatus {
  SUCCESS,
  ERROR,
}

export class ActionResponse<T = any> {
  type: ActionResponseStatus;
  message: string;
  data: { [val: string]: Partial<T> };

  constructor(type: ActionResponseStatus, message: string, data?: any) {
    this.type = type;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data: { [val: string]: Partial<T> }) {
    return new ActionResponse(ActionResponseStatus.SUCCESS, message, data);
  }

  static error(message: string, data?: any) {
    return new ActionResponse(ActionResponseStatus.ERROR, message, data);
  }

  toJSON() {
    return JSON.stringify({
      type: this.type,
      message: this.message,
      data: this.data,
    });
  }

  static fromJSON<T>(string: any) {
    const json = JSON.parse(string);
    const { type, message, data } = json;
    return new ActionResponse<T>(type, message, data);
  }
}
