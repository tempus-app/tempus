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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Tempus1649855002713 = void 0;
var Tempus1649855002713 = /** @class */ (function () {
    function Tempus1649855002713() {
        this.name = 'Tempus1649855002713';
    }
    Tempus1649855002713.prototype.up = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"user_entity_roles_enum\" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_entity\" (\"id\" SERIAL NOT NULL, \"firstName\" character varying, \"lastName\" character varying, \"email\" character varying, \"password\" character varying, \"refreshToken\" character varying, \"roles\" \"public\".\"user_entity_roles_enum\" array NOT NULL DEFAULT '{USER}', \"phoneNumber\" character varying, \"linkedInLink\" character varying, \"githubLink\" character varying, \"otherLink\" character varying, \"title\" character varying, \"user_type\" character varying NOT NULL, CONSTRAINT \"PK_b54f8ea623b17094db7667d8206\" PRIMARY KEY (\"id\"))")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_5539824562fac4b1526e30ff65\" ON \"user_entity\" (\"user_type\") ")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"location_entity\" (\"id\" SERIAL NOT NULL, \"city\" character varying NOT NULL, \"province\" character varying NOT NULL, \"country\" character varying NOT NULL, \"educationId\" integer, \"experienceId\" integer, \"resourceId\" integer, CONSTRAINT \"REL_668e14c8af642db36ba9c66207\" UNIQUE (\"educationId\"), CONSTRAINT \"REL_9608b4cdc739fd432fca4245fc\" UNIQUE (\"experienceId\"), CONSTRAINT \"REL_9c0dfb467e8e6625bbbb51591e\" UNIQUE (\"resourceId\"), CONSTRAINT \"PK_9debf81cdf142d284fce9b8fd7b\" PRIMARY KEY (\"id\"))")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"education_entity\" (\"id\" SERIAL NOT NULL, \"degree\" character varying NOT NULL, \"institution\" character varying NOT NULL, \"startDate\" TIMESTAMP NOT NULL, \"endDate\" TIMESTAMP, \"resourceId\" integer, CONSTRAINT \"PK_79c0b39bc47664de1f081eeb325\" PRIMARY KEY (\"id\"))")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"skill_type_entity\" (\"name\" character varying NOT NULL, CONSTRAINT \"UQ_9573cdb8b65435a179b3fa1c10b\" UNIQUE (\"name\"), CONSTRAINT \"primary_key_constraint\" UNIQUE (\"name\"), CONSTRAINT \"PK_9573cdb8b65435a179b3fa1c10b\" PRIMARY KEY (\"name\"))")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"skill_entity\" (\"id\" SERIAL NOT NULL, \"skill_key\" character varying, \"resourceId\" integer, CONSTRAINT \"PK_f15d4d9999e79c842fdef236ecc\" PRIMARY KEY (\"id\"))")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"experience_entity\" (\"id\" SERIAL NOT NULL, \"company\" character varying NOT NULL, \"title\" character varying NOT NULL, \"summary\" character varying NOT NULL, \"description\" text, \"startDate\" TIMESTAMP NOT NULL, \"endDate\" TIMESTAMP, \"resourceId\" integer, CONSTRAINT \"PK_3372eeacfcc42b5387b811b032e\" PRIMARY KEY (\"id\"))")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"view_entity_updated_by_enum\" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"view_entity_revision_type_enum\" AS ENUM('APPROVED', 'NEW', 'REJECTED')")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"view_entity_created_by_enum\" AS ENUM('ASSIGNED_RESOURCE', 'AVAILABLE_RESOURCE', 'BUSINESS_OWNER', 'SUPERVISOR', 'USER')")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"view_entity_view_type_enum\" AS ENUM('PRIMARY', 'SECONDARY')")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"view_entity\" (\"id\" SERIAL NOT NULL, \"profileSummary\" character varying, \"skillsSummary\" character varying, \"educationsSummary\" character varying, \"experiencesSummary\" character varying, \"type\" character varying NOT NULL, \"locked\" boolean NOT NULL, \"lastUpdateDate\" TIMESTAMP, \"created_at\" TIMESTAMP NOT NULL, \"updated_by\" \"public\".\"view_entity_updated_by_enum\" DEFAULT 'USER', \"revision_type\" \"public\".\"view_entity_revision_type_enum\" NOT NULL DEFAULT 'NEW', \"created_by\" \"public\".\"view_entity_created_by_enum\" NOT NULL DEFAULT 'USER', \"view_type\" \"public\".\"view_entity_view_type_enum\" NOT NULL DEFAULT 'SECONDARY', \"resourceId\" integer, CONSTRAINT \"PK_7c62a99cd63e88462f6de3de711\" PRIMARY KEY (\"id\"))")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"revision_entity\" (\"id\" SERIAL NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"comment\" character varying, \"approved\" boolean, \"viewId\" integer, \"newViewId\" integer, CONSTRAINT \"REL_840ccd6b9cc6de8a1b468b57e5\" UNIQUE (\"viewId\"), CONSTRAINT \"REL_efc0aa4d3a4c4c318e9873eae8\" UNIQUE (\"newViewId\"), CONSTRAINT \"PK_fcbc51824a098242d79fb31e68d\" PRIMARY KEY (\"id\"))")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"certification_entity\" (\"id\" SERIAL NOT NULL, \"title\" character varying NOT NULL, \"institution\" character varying NOT NULL, \"summary\" character varying NOT NULL, \"resourceId\" integer, CONSTRAINT \"PK_2629187ea339f87d46ee1539d3a\" PRIMARY KEY (\"id\"))")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"project_entity\" (\"id\" SERIAL NOT NULL, \"name\" character varying NOT NULL, \"startDate\" TIMESTAMP NOT NULL, \"endDate\" TIMESTAMP NOT NULL, \"clientId\" integer, CONSTRAINT \"PK_7a75a94e01d0b50bff123db1b87\" PRIMARY KEY (\"id\"))")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"client_entity\" (\"id\" SERIAL NOT NULL, \"name\" character varying NOT NULL, \"title\" character varying NOT NULL, \"clientName\" character varying NOT NULL, CONSTRAINT \"PK_b730a3f25cd74d13a5cb68cbc59\" PRIMARY KEY (\"id\"))")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"task_entity\" (\"id\" SERIAL NOT NULL, \"taskName\" character varying NOT NULL, CONSTRAINT \"PK_0385ca690d1697cdf7ff1ed3c2f\" PRIMARY KEY (\"id\"))")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TYPE \"public\".\"link_entity_status_enum\" AS ENUM('ACTIVE', 'INACTIVE', 'COMPLETED')")];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"link_entity\" (\"id\" SERIAL NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"firstName\" character varying NOT NULL, \"lastName\" character varying NOT NULL, \"email\" character varying NOT NULL, \"expiry\" TIMESTAMP NOT NULL, \"token\" character varying NOT NULL, \"status\" \"public\".\"link_entity_status_enum\" NOT NULL DEFAULT 'ACTIVE', \"userId\" integer, \"projectId\" integer, CONSTRAINT \"UQ_9457468f6bf7dbf40ee7d1e4214\" UNIQUE (\"email\"), CONSTRAINT \"UQ_efd2ce800d1e8b705c2de890fe9\" UNIQUE (\"token\"), CONSTRAINT \"REL_3fae39782976ac5f7b77e10286\" UNIQUE (\"userId\"), CONSTRAINT \"PK_af89bd9225033257aea716f2cc4\" PRIMARY KEY (\"id\"))")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"user_entity_projects_project_entity\" (\"userEntityId\" integer NOT NULL, \"projectEntityId\" integer NOT NULL, CONSTRAINT \"PK_5d703a577354b2b7863e16d0ef7\" PRIMARY KEY (\"userEntityId\", \"projectEntityId\"))")];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_51b3f107d07ef47f535084f5df\" ON \"user_entity_projects_project_entity\" (\"userEntityId\") ")];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_f09d06ae90ffabc21ee8db9374\" ON \"user_entity_projects_project_entity\" (\"projectEntityId\") ")];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"view_entity_skills_skill_entity\" (\"viewEntityId\" integer NOT NULL, \"skillEntityId\" integer NOT NULL, CONSTRAINT \"PK_ff9a8f775f04b09aee741758275\" PRIMARY KEY (\"viewEntityId\", \"skillEntityId\"))")];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_516eb8a9fd219674c94ecf596b\" ON \"view_entity_skills_skill_entity\" (\"viewEntityId\") ")];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_44ccf5197bfdaad656a9ff638d\" ON \"view_entity_skills_skill_entity\" (\"skillEntityId\") ")];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"view_entity_experiences_experience_entity\" (\"viewEntityId\" integer NOT NULL, \"experienceEntityId\" integer NOT NULL, CONSTRAINT \"PK_23fd6b655bb1013343e61b00f73\" PRIMARY KEY (\"viewEntityId\", \"experienceEntityId\"))")];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_d7415bbc1db8d239b250192f41\" ON \"view_entity_experiences_experience_entity\" (\"viewEntityId\") ")];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_baab19e8885724c2910f28efb3\" ON \"view_entity_experiences_experience_entity\" (\"experienceEntityId\") ")];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"view_entity_educations_education_entity\" (\"viewEntityId\" integer NOT NULL, \"educationEntityId\" integer NOT NULL, CONSTRAINT \"PK_bcf8c80dd9d55960bad74372c9c\" PRIMARY KEY (\"viewEntityId\", \"educationEntityId\"))")];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_9f8aefde6b0cc173ad8077b802\" ON \"view_entity_educations_education_entity\" (\"viewEntityId\") ")];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_4ef6d2af536f07a1b49b5bb30b\" ON \"view_entity_educations_education_entity\" (\"educationEntityId\") ")];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE TABLE \"view_entity_certifications_certification_entity\" (\"viewEntityId\" integer NOT NULL, \"certificationEntityId\" integer NOT NULL, CONSTRAINT \"PK_501ae12c7e9953bef5242be4cdf\" PRIMARY KEY (\"viewEntityId\", \"certificationEntityId\"))")];
                    case 33:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_9be7352d7f2b554afc971d65a4\" ON \"view_entity_certifications_certification_entity\" (\"viewEntityId\") ")];
                    case 34:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("CREATE INDEX \"IDX_68d8d04cfb65f280e028393860\" ON \"view_entity_certifications_certification_entity\" (\"certificationEntityId\") ")];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"location_entity\" ADD CONSTRAINT \"FK_668e14c8af642db36ba9c662070\" FOREIGN KEY (\"educationId\") REFERENCES \"education_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 36:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"location_entity\" ADD CONSTRAINT \"FK_9608b4cdc739fd432fca4245fc1\" FOREIGN KEY (\"experienceId\") REFERENCES \"experience_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 37:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"location_entity\" ADD CONSTRAINT \"FK_9c0dfb467e8e6625bbbb51591e8\" FOREIGN KEY (\"resourceId\") REFERENCES \"user_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 38:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"education_entity\" ADD CONSTRAINT \"FK_284de4181df82f8c0de55f038d8\" FOREIGN KEY (\"resourceId\") REFERENCES \"user_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 39:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"skill_entity\" ADD CONSTRAINT \"FK_4188b06c3ce5cbf5db98e7f2de8\" FOREIGN KEY (\"skill_key\") REFERENCES \"skill_type_entity\"(\"name\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 40:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"skill_entity\" ADD CONSTRAINT \"FK_681d564eb2b4a7c45435407b2e1\" FOREIGN KEY (\"resourceId\") REFERENCES \"user_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 41:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"experience_entity\" ADD CONSTRAINT \"FK_e596bbe6a63a4582cf76f2e96bf\" FOREIGN KEY (\"resourceId\") REFERENCES \"user_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 42:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity\" ADD CONSTRAINT \"FK_aa4fa806e45e973ae78f0ca7fcb\" FOREIGN KEY (\"resourceId\") REFERENCES \"user_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 43:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"revision_entity\" ADD CONSTRAINT \"FK_840ccd6b9cc6de8a1b468b57e54\" FOREIGN KEY (\"viewId\") REFERENCES \"view_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 44:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"revision_entity\" ADD CONSTRAINT \"FK_efc0aa4d3a4c4c318e9873eae86\" FOREIGN KEY (\"newViewId\") REFERENCES \"view_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 45:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"certification_entity\" ADD CONSTRAINT \"FK_baf89d5fc358ef43065075bb950\" FOREIGN KEY (\"resourceId\") REFERENCES \"user_entity\"(\"id\") ON DELETE CASCADE ON UPDATE NO ACTION")];
                    case 46:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"project_entity\" ADD CONSTRAINT \"FK_ffbc40a4ea40654c24f9ba9450d\" FOREIGN KEY (\"clientId\") REFERENCES \"client_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"link_entity\" ADD CONSTRAINT \"FK_3fae39782976ac5f7b77e10286c\" FOREIGN KEY (\"userId\") REFERENCES \"user_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"link_entity\" ADD CONSTRAINT \"FK_a9bfe2700588e8033646752c260\" FOREIGN KEY (\"projectId\") REFERENCES \"project_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 49:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_entity_projects_project_entity\" ADD CONSTRAINT \"FK_51b3f107d07ef47f535084f5df1\" FOREIGN KEY (\"userEntityId\") REFERENCES \"user_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 50:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_entity_projects_project_entity\" ADD CONSTRAINT \"FK_f09d06ae90ffabc21ee8db9374b\" FOREIGN KEY (\"projectEntityId\") REFERENCES \"project_entity\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION")];
                    case 51:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_skills_skill_entity\" ADD CONSTRAINT \"FK_516eb8a9fd219674c94ecf596bf\" FOREIGN KEY (\"viewEntityId\") REFERENCES \"view_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 52:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_skills_skill_entity\" ADD CONSTRAINT \"FK_44ccf5197bfdaad656a9ff638d6\" FOREIGN KEY (\"skillEntityId\") REFERENCES \"skill_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 53:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_experiences_experience_entity\" ADD CONSTRAINT \"FK_d7415bbc1db8d239b250192f410\" FOREIGN KEY (\"viewEntityId\") REFERENCES \"view_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 54:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_experiences_experience_entity\" ADD CONSTRAINT \"FK_baab19e8885724c2910f28efb3d\" FOREIGN KEY (\"experienceEntityId\") REFERENCES \"experience_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 55:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_educations_education_entity\" ADD CONSTRAINT \"FK_9f8aefde6b0cc173ad8077b8027\" FOREIGN KEY (\"viewEntityId\") REFERENCES \"view_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 56:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_educations_education_entity\" ADD CONSTRAINT \"FK_4ef6d2af536f07a1b49b5bb30b0\" FOREIGN KEY (\"educationEntityId\") REFERENCES \"education_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 57:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_certifications_certification_entity\" ADD CONSTRAINT \"FK_9be7352d7f2b554afc971d65a45\" FOREIGN KEY (\"viewEntityId\") REFERENCES \"view_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 58:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_certifications_certification_entity\" ADD CONSTRAINT \"FK_68d8d04cfb65f280e0283938601\" FOREIGN KEY (\"certificationEntityId\") REFERENCES \"certification_entity\"(\"id\") ON DELETE CASCADE ON UPDATE CASCADE")];
                    case 59:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Tempus1649855002713.prototype.down = function (queryRunner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_certifications_certification_entity\" DROP CONSTRAINT \"FK_68d8d04cfb65f280e0283938601\"")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_certifications_certification_entity\" DROP CONSTRAINT \"FK_9be7352d7f2b554afc971d65a45\"")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_educations_education_entity\" DROP CONSTRAINT \"FK_4ef6d2af536f07a1b49b5bb30b0\"")];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_educations_education_entity\" DROP CONSTRAINT \"FK_9f8aefde6b0cc173ad8077b8027\"")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_experiences_experience_entity\" DROP CONSTRAINT \"FK_baab19e8885724c2910f28efb3d\"")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_experiences_experience_entity\" DROP CONSTRAINT \"FK_d7415bbc1db8d239b250192f410\"")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_skills_skill_entity\" DROP CONSTRAINT \"FK_44ccf5197bfdaad656a9ff638d6\"")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity_skills_skill_entity\" DROP CONSTRAINT \"FK_516eb8a9fd219674c94ecf596bf\"")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_entity_projects_project_entity\" DROP CONSTRAINT \"FK_f09d06ae90ffabc21ee8db9374b\"")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"user_entity_projects_project_entity\" DROP CONSTRAINT \"FK_51b3f107d07ef47f535084f5df1\"")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"link_entity\" DROP CONSTRAINT \"FK_a9bfe2700588e8033646752c260\"")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"link_entity\" DROP CONSTRAINT \"FK_3fae39782976ac5f7b77e10286c\"")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"project_entity\" DROP CONSTRAINT \"FK_ffbc40a4ea40654c24f9ba9450d\"")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"certification_entity\" DROP CONSTRAINT \"FK_baf89d5fc358ef43065075bb950\"")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"revision_entity\" DROP CONSTRAINT \"FK_efc0aa4d3a4c4c318e9873eae86\"")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"revision_entity\" DROP CONSTRAINT \"FK_840ccd6b9cc6de8a1b468b57e54\"")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"view_entity\" DROP CONSTRAINT \"FK_aa4fa806e45e973ae78f0ca7fcb\"")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"experience_entity\" DROP CONSTRAINT \"FK_e596bbe6a63a4582cf76f2e96bf\"")];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"skill_entity\" DROP CONSTRAINT \"FK_681d564eb2b4a7c45435407b2e1\"")];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"skill_entity\" DROP CONSTRAINT \"FK_4188b06c3ce5cbf5db98e7f2de8\"")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"education_entity\" DROP CONSTRAINT \"FK_284de4181df82f8c0de55f038d8\"")];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"location_entity\" DROP CONSTRAINT \"FK_9c0dfb467e8e6625bbbb51591e8\"")];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"location_entity\" DROP CONSTRAINT \"FK_9608b4cdc739fd432fca4245fc1\"")];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("ALTER TABLE \"location_entity\" DROP CONSTRAINT \"FK_668e14c8af642db36ba9c662070\"")];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_68d8d04cfb65f280e028393860\"")];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_9be7352d7f2b554afc971d65a4\"")];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"view_entity_certifications_certification_entity\"")];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_4ef6d2af536f07a1b49b5bb30b\"")];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_9f8aefde6b0cc173ad8077b802\"")];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"view_entity_educations_education_entity\"")];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_baab19e8885724c2910f28efb3\"")];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_d7415bbc1db8d239b250192f41\"")];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"view_entity_experiences_experience_entity\"")];
                    case 33:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_44ccf5197bfdaad656a9ff638d\"")];
                    case 34:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_516eb8a9fd219674c94ecf596b\"")];
                    case 35:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"view_entity_skills_skill_entity\"")];
                    case 36:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_f09d06ae90ffabc21ee8db9374\"")];
                    case 37:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_51b3f107d07ef47f535084f5df\"")];
                    case 38:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_entity_projects_project_entity\"")];
                    case 39:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"link_entity\"")];
                    case 40:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"link_entity_status_enum\"")];
                    case 41:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"task_entity\"")];
                    case 42:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"client_entity\"")];
                    case 43:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"project_entity\"")];
                    case 44:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"certification_entity\"")];
                    case 45:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"revision_entity\"")];
                    case 46:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"view_entity\"")];
                    case 47:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"view_entity_view_type_enum\"")];
                    case 48:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"view_entity_created_by_enum\"")];
                    case 49:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"view_entity_revision_type_enum\"")];
                    case 50:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"view_entity_updated_by_enum\"")];
                    case 51:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"experience_entity\"")];
                    case 52:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"skill_entity\"")];
                    case 53:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"skill_type_entity\"")];
                    case 54:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"education_entity\"")];
                    case 55:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"location_entity\"")];
                    case 56:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP INDEX \"public\".\"IDX_5539824562fac4b1526e30ff65\"")];
                    case 57:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TABLE \"user_entity\"")];
                    case 58:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.query("DROP TYPE \"public\".\"user_entity_roles_enum\"")];
                    case 59:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Tempus1649855002713;
}());
exports.Tempus1649855002713 = Tempus1649855002713;
