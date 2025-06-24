"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
let server;
const PORT = process.env.PORT || 5000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pns8cwr.mongodb.net/library_management_db?retryWrites=true&w=majority&appName=Cluster0`);
            console.log("Connect to MongoDB with Mongoose successfully✅");
            server = app_1.default.listen(PORT, () => __awaiter(this, void 0, void 0, function* () {
                console.log(`Library management app is running🏃🏼‍♂️ on port ${PORT}`);
            }));
        }
        catch (error) {
            console.error("Failed to connect to MongoDB or start server:", error);
            process.exit(1);
        }
    });
}
main();
