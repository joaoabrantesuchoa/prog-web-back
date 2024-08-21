"use strict";

// DEPENDENCIES
const gulp = require("gulp"),
  tslint = require("gulp-tslint"),
  ts = require("gulp-typescript"),
  nodemon = require("gulp-nodemon"),
  plumber = require("gulp-plumber");

// TSLINT
gulp.task("ts-lint", () => {
  return gulp
    .src(["src/**/*.ts"])
    .pipe(plumber()) // Evita o término do processo em caso de erro
    .pipe(
      tslint({
        formatter: "verbose",
      })
    )
    .pipe(
      tslint.report({
        reportLimit: 5,
      })
    );
});

// COPY FILES
gulp.task("copy-files", () => {
  return gulp.src("package.json").pipe(gulp.dest("dist"));
});

// BUILD TASK
gulp.task("build", () => {
  const tsProject = ts.createProject("tsconfig.json");
  return tsProject
    .src()
    .pipe(plumber()) // Evita o término do processo em caso de erro
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"));
});

// WATCH TASK
gulp.task("watch", () => {
  gulp.watch("src/**/*.ts", gulp.series("build"));
  nodemon({
    script: "dist/server.js",
    tasks: ["build"],
    ext: "ts json",
    ignore: ["node_modules/", "package.json", "tsconfig.json"],
    done: () => {
      console.log("Nodemon iniciado");
    },
  })
    .on("restart", () => {
      console.log("Server reiniciado...");
    })
    .on("crash", () => {
      console.error("Aplicação travou!");
    });
});

// DEV TASK
gulp.task("dev", gulp.series("build", "watch"));
