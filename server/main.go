package main

import (
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Project struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Event struct {
	ID        int    `json:"id"`
	ProjectID int    `json:"projectId"`
	Name      string `json:"name"`
	Page      string `json:"page"`
}

func main() {
	projects := []Project{
		{ID: 1, Name: "Valvet"},
		{ID: 2, Name: "Project 2"},
	}

	events := []Event{
		{ID: 1, ProjectID: 1, Name: "pageview", Page: "/index.html"},
		{ID: 2, ProjectID: 1, Name: "pageview", Page: "/index.html"},
		{ID: 3, ProjectID: 1, Name: "pageview", Page: "/other.html"},
		{ID: 4, ProjectID: 2, Name: "pageview", Page: "/index.html"},
	}

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	})

	router.GET("/projects", func(c *gin.Context) {
		c.JSON(http.StatusOK, projects)
	})

	router.GET("/events", func(c *gin.Context) {
		projectID := c.Query("projectId")
		filteredEvents := []Event{}
		for _, event := range events {
			if strconv.Itoa(event.ProjectID) == projectID {
				filteredEvents = append(filteredEvents, event)
			}
		}
		c.JSON(http.StatusOK, filteredEvents)
	})

	log.Fatal(router.Run(":8080"))
}
