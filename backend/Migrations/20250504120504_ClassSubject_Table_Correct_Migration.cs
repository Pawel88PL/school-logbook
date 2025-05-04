using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ClassSubject_Table_Correct_Migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassSubject_Classes_ClassId",
                table: "ClassSubject");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSubject_Subjects_SubjectId",
                table: "ClassSubject");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSubject_Teachers_TeacherId",
                table: "ClassSubject");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClassSubject",
                table: "ClassSubject");

            migrationBuilder.RenameTable(
                name: "ClassSubject",
                newName: "ClassSubjects");

            migrationBuilder.RenameIndex(
                name: "IX_ClassSubject_TeacherId",
                table: "ClassSubjects",
                newName: "IX_ClassSubjects_TeacherId");

            migrationBuilder.RenameIndex(
                name: "IX_ClassSubject_SubjectId",
                table: "ClassSubjects",
                newName: "IX_ClassSubjects_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ClassSubject_ClassId",
                table: "ClassSubjects",
                newName: "IX_ClassSubjects_ClassId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassSubjects",
                table: "ClassSubjects",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSubjects_Classes_ClassId",
                table: "ClassSubjects",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSubjects_Subjects_SubjectId",
                table: "ClassSubjects",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSubjects_Teachers_TeacherId",
                table: "ClassSubjects",
                column: "TeacherId",
                principalTable: "Teachers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassSubjects_Classes_ClassId",
                table: "ClassSubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSubjects_Subjects_SubjectId",
                table: "ClassSubjects");

            migrationBuilder.DropForeignKey(
                name: "FK_ClassSubjects_Teachers_TeacherId",
                table: "ClassSubjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ClassSubjects",
                table: "ClassSubjects");

            migrationBuilder.RenameTable(
                name: "ClassSubjects",
                newName: "ClassSubject");

            migrationBuilder.RenameIndex(
                name: "IX_ClassSubjects_TeacherId",
                table: "ClassSubject",
                newName: "IX_ClassSubject_TeacherId");

            migrationBuilder.RenameIndex(
                name: "IX_ClassSubjects_SubjectId",
                table: "ClassSubject",
                newName: "IX_ClassSubject_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_ClassSubjects_ClassId",
                table: "ClassSubject",
                newName: "IX_ClassSubject_ClassId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ClassSubject",
                table: "ClassSubject",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSubject_Classes_ClassId",
                table: "ClassSubject",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSubject_Subjects_SubjectId",
                table: "ClassSubject",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ClassSubject_Teachers_TeacherId",
                table: "ClassSubject",
                column: "TeacherId",
                principalTable: "Teachers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
