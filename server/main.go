package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"server/repository"
	"strconv"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	connStr := "./webstats.db"

	db, err := sql.Open("sqlite3", connStr)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Content-Type", "application/json")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})

	projectRepo := repository.NewProjectRepository(db)
	eventRepo := repository.NewEventRepository(db)
	ctx := context.Background()

	router.GET("/project", func(c *gin.Context) {
		projects, err := projectRepo.GetAll(ctx)
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusOK, projects)
	})

	router.POST("/project", func(c *gin.Context) {
		var project repository.Project
		if err := c.ShouldBindJSON(&project); err != nil {
			log.Fatal(err)
		}
		err := projectRepo.Create(ctx, &project)
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusCreated, project)
	})

	router.GET("/event/:projectId", func(c *gin.Context) {
		projectIDStr := c.Param("projectId")
		projectID, err := strconv.Atoi(projectIDStr)
		if err != nil {
			log.Fatal(err)
		}
		events, err := eventRepo.GetByProjectID(ctx, projectID)
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusOK, events)
	})

	router.POST("/event", func(c *gin.Context) {
		var event repository.Event
		if err := c.ShouldBindJSON(&event); err != nil {
			log.Fatal(err)
		}
		err := eventRepo.Create(ctx, &event)
		if err != nil {
			log.Fatal(err)
		}
		c.JSON(http.StatusCreated, event)
	})

	log.Fatal(router.Run(":8080"))
}
