package main

import (
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/josemcorderoc/elecciones-chile-visualizer/models"
)

func main() {
	r := gin.Default()
	r.GET("/votes", func(c *gin.Context) {

		electionID_param, electionIDExists := c.GetQuery("eleccion_id")
		candidateID_param, candidateIDExists := c.GetQuery("candidato_id")
		comunaIDs_param, comunaIDsExists := c.GetQueryArray("comuna_ids")

		if !(electionIDExists &&  candidateIDExists && comunaIDsExists) {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":  "Parameters eleccion_id, candidato_id, comuna_ids are mandatory",
			})
			return
		}

		electionID, err := strconv.Atoi(electionID_param)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Failed to parse eleccion_id as integer",
			})
			return
		}

		candidateID, err := strconv.Atoi(candidateID_param)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Failed to parse candidato_id as integer",
			})
			return
		}
		
		var comunaIDs = []int{}
		for _, i := range comunaIDs_param {
			j, err := strconv.Atoi(i)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{
					"error": "Failed to parse comuna_ids as integers",
				})
				return
			}
			comunaIDs = append(comunaIDs, j)
		}

		// connect to DB
		db, err := models.InitPostgresDB(
			os.Getenv("DB_NAME"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"),
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err,
			})
			return
		}

		// make query
		outcome, err := models.FindOutcomeElectionCandidateComunas(electionID, candidateID, comunaIDs, db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err,
			})
			return
		}
		
		// serialize and send data
		c.JSON(http.StatusOK, gin.H{
			"results": outcome,
		})
	})
	r.Run()
}
