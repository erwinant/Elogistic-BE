"use strict";

class ParamSequelieze {
  set sql(sql) {
    this._sql = sql;
  }

  get sql() {
    return this._sql;
  }

  set bindParam(bindParam) {
    this._bindParam = bindParam;
  }

  get bindParam() {
    return this._bindParam;
  }

  set successMessage(successMessage) {
    this._successMessage = successMessage;
  }

  get successMessage() {
    return this._successMessage;
  }

  set errorMessage(errorMessage) {
    this._errorMessage = errorMessage;
  }

  get errorMessage() {
    return this._errorMessage;
  }
}

module.exports = ParamSequelieze;
