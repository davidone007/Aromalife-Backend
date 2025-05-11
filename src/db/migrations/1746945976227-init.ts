import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1746945976227 implements MigrationInterface {
    name = 'Init1746945976227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "container" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "image_url" character varying NOT NULL, "base_price" numeric(10,2) NOT NULL, "dimensions" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_74656f796df3346fa6ec89fa727" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "place" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_96ab91d43aa89c5de1b59ee7cca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "main_option" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "description" text, "emoji" character varying(10), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_557d23b62ad018cb3615c3af066" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "intended_impact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "icon" character varying, "description" character varying, "placeId" uuid, "mainOptionId" uuid, CONSTRAINT "PK_dc921c2e95f578b985471a61c24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "aroma" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "olfative_pyramid" json NOT NULL, "image_url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1070d4e9d71d2461e334d50669a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "candle" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "price" numeric(10,2) NOT NULL, "imageUrl" character varying, "audioUrl" character varying, "message" character varying, "qrUrl" character varying, "orderId" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "containerId" uuid, "aromaId" uuid, CONSTRAINT "PK_e4bfba00b826f30058f10eb59d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "orderId" uuid NOT NULL, "candleId" uuid, "giftId" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gift" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "price" numeric(10,2) NOT NULL, "image_url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f91217caddc01a085837ebe0606" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unitPrice" numeric(10,2) NOT NULL, "totalPrice" numeric(10,2) NOT NULL, "cartId" uuid, "giftId" uuid, "candleId" uuid, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "checkedOut" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "roles" text array NOT NULL DEFAULT '{}', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "totalAmount" numeric(10,2) NOT NULL, "shippingAddress" jsonb NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT 'PENDING', "paymentDetails" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "review" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "rating" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" uuid, CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "aroma_intended_impacts_intended_impact" ("aromaId" uuid NOT NULL, "intendedImpactId" uuid NOT NULL, CONSTRAINT "PK_9d540be5d75fd85037932e3c3bd" PRIMARY KEY ("aromaId", "intendedImpactId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6e9453fbc6222d49162b31b475" ON "aroma_intended_impacts_intended_impact" ("aromaId") `);
        await queryRunner.query(`CREATE INDEX "IDX_82f643346f3d1a82a193812d1a" ON "aroma_intended_impacts_intended_impact" ("intendedImpactId") `);
        await queryRunner.query(`ALTER TABLE "intended_impact" ADD CONSTRAINT "FK_f93be4ce41951c5f7f23fc2ebb2" FOREIGN KEY ("placeId") REFERENCES "place"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "intended_impact" ADD CONSTRAINT "FK_8255db69bf18214be98cb173bc9" FOREIGN KEY ("mainOptionId") REFERENCES "main_option"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candle" ADD CONSTRAINT "FK_09f6da7aba3652337d0e50b8982" FOREIGN KEY ("containerId") REFERENCES "container"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "candle" ADD CONSTRAINT "FK_110164c6de63f01792fd14e518e" FOREIGN KEY ("aromaId") REFERENCES "aroma"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_70ba778bbb77fbeff141866cec3" FOREIGN KEY ("candleId") REFERENCES "candle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_f3dbfdc2bafb4edcfc5076225a0" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_2cbaa5187a29e4f272021e8bac8" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_item" ADD CONSTRAINT "FK_7d2b73c9cf4ddb65731725bc001" FOREIGN KEY ("candleId") REFERENCES "candle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_31db76b2d6dfe81d69e27b66c20" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "aroma_intended_impacts_intended_impact" ADD CONSTRAINT "FK_6e9453fbc6222d49162b31b475b" FOREIGN KEY ("aromaId") REFERENCES "aroma"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "aroma_intended_impacts_intended_impact" ADD CONSTRAINT "FK_82f643346f3d1a82a193812d1af" FOREIGN KEY ("intendedImpactId") REFERENCES "intended_impact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "aroma_intended_impacts_intended_impact" DROP CONSTRAINT "FK_82f643346f3d1a82a193812d1af"`);
        await queryRunner.query(`ALTER TABLE "aroma_intended_impacts_intended_impact" DROP CONSTRAINT "FK_6e9453fbc6222d49162b31b475b"`);
        await queryRunner.query(`ALTER TABLE "review" DROP CONSTRAINT "FK_31db76b2d6dfe81d69e27b66c20"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_756f53ab9466eb52a52619ee019"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_7d2b73c9cf4ddb65731725bc001"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_2cbaa5187a29e4f272021e8bac8"`);
        await queryRunner.query(`ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_f3dbfdc2bafb4edcfc5076225a0"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_70ba778bbb77fbeff141866cec3"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`);
        await queryRunner.query(`ALTER TABLE "candle" DROP CONSTRAINT "FK_110164c6de63f01792fd14e518e"`);
        await queryRunner.query(`ALTER TABLE "candle" DROP CONSTRAINT "FK_09f6da7aba3652337d0e50b8982"`);
        await queryRunner.query(`ALTER TABLE "intended_impact" DROP CONSTRAINT "FK_8255db69bf18214be98cb173bc9"`);
        await queryRunner.query(`ALTER TABLE "intended_impact" DROP CONSTRAINT "FK_f93be4ce41951c5f7f23fc2ebb2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_82f643346f3d1a82a193812d1a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6e9453fbc6222d49162b31b475"`);
        await queryRunner.query(`DROP TABLE "aroma_intended_impacts_intended_impact"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`DROP TABLE "gift"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "candle"`);
        await queryRunner.query(`DROP TABLE "aroma"`);
        await queryRunner.query(`DROP TABLE "intended_impact"`);
        await queryRunner.query(`DROP TABLE "main_option"`);
        await queryRunner.query(`DROP TABLE "place"`);
        await queryRunner.query(`DROP TABLE "container"`);
    }

}
