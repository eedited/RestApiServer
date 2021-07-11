"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
app.set('port', process.env.PORT || 8000);
app.get('/', function (req, res, next) {
    var a = 3;
    console.log(a);
    res.send('hello typescript express!!');
});
app.listen(app.get('port'), function () {
    console.log("Listening on Port " + app.get('port') + "...");
});
;
//# sourceMappingURL=index.js.map