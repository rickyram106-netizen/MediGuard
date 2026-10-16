
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MediGuardAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddUserTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_medicines",
                table: "medicines");

            migrationBuilder.RenameTable(
                name: "medicines",
                newName: "Medicines");

            migrationBuilder.RenameColumn(
                name: "unit",
                table: "Medicines",
                newName: "Unit");

            migrationBuilder.RenameColumn(
                name: "notes",
                table: "Medicines",
                newName: "Notes");

            migrationBuilder.RenameColumn(
                name: "frequency",
                table: "Medicines",
                newName: "Frequency");

            migrationBuilder.RenameColumn(
                name: "dosage",
                table: "Medicines",
                newName: "Dosage");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Medicines",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "Medicines",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "start_date",
                table: "Medicines",
                newName: "StartDate");

            migrationBuilder.RenameColumn(
                name: "medicine_name",
                table: "Medicines",
                newName: "MedicineName");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "Medicines",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "generic_name",
                table: "Medicines",
                newName: "GenericName");

            migrationBuilder.RenameColumn(
                name: "end_date",
                table: "Medicines",
                newName: "EndDate");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Medicines",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "brand_name",
                table: "Medicines",
                newName: "BrandName");

            migrationBuilder.RenameColumn(
                name: "before_food",
                table: "Medicines",
                newName: "BeforeFood");

            migrationBuilder.RenameColumn(
                name: "medicine_id",
                table: "Medicines",
                newName: "MedicineId");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "Medicines",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldMaxLength: 500,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Medicines",
                keyColumn: "Frequency",
                keyValue: null,
                column: "Frequency",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Frequency",
                table: "Medicines",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Medicines",
                keyColumn: "Dosage",
                keyValue: null,
                column: "Dosage",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Dosage",
                table: "Medicines",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MedicineName",
                table: "Medicines",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(150)",
                oldMaxLength: 150)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "GenericName",
                table: "Medicines",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(150)",
                oldMaxLength: 150,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "BrandName",
                table: "Medicines",
                type: "varchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Medicines",
                table: "Medicines",
                column: "MedicineId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Medicines",
                table: "Medicines");

            migrationBuilder.RenameTable(
                name: "Medicines",
                newName: "medicines");

            migrationBuilder.RenameColumn(
                name: "Unit",
                table: "medicines",
                newName: "unit");

            migrationBuilder.RenameColumn(
                name: "Notes",
                table: "medicines",
                newName: "notes");

            migrationBuilder.RenameColumn(
                name: "Frequency",
                table: "medicines",
                newName: "frequency");

            migrationBuilder.RenameColumn(
                name: "Dosage",
                table: "medicines",
                newName: "dosage");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "medicines",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "medicines",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "medicines",
                newName: "start_date");

            migrationBuilder.RenameColumn(
                name: "MedicineName",
                table: "medicines",
                newName: "medicine_name");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "medicines",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "GenericName",
                table: "medicines",
                newName: "generic_name");

            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "medicines",
                newName: "end_date");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "medicines",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "BrandName",
                table: "medicines",
                newName: "brand_name");

            migrationBuilder.RenameColumn(
                name: "BeforeFood",
                table: "medicines",
                newName: "before_food");

            migrationBuilder.RenameColumn(
                name: "MedicineId",
                table: "medicines",
                newName: "medicine_id");

            migrationBuilder.AlterColumn<string>(
                name: "notes",
                table: "medicines",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "frequency",
                table: "medicines",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "dosage",
                table: "medicines",
                type: "varchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "medicine_name",
                table: "medicines",
                type: "varchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "generic_name",
                table: "medicines",
                type: "varchar(150)",
                maxLength: 150,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "brand_name",
                table: "medicines",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(200)",
                oldMaxLength: 200,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddPrimaryKey(
                name: "PK_medicines",
                table: "medicines",
                column: "medicine_id");
        }
    }
}
