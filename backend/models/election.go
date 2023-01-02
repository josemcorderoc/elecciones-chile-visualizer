package models

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type ElectionOutcome struct {
	CandidatoID int
	ComunaID    int
	EleccionID  int
	Votos int
}

func InitPostgresDB(database string, user string, password string) (*sqlx.DB, error) {
	return sqlx.Open(
		"postgres",
		fmt.Sprintf("user=%s dbname=%s sslmode=disable", user, database),
	)
}
func FindOutcomeElectionCandidateComunas(electionID int, candidateID int, comunaIDs []int, db *sqlx.DB) ([]ElectionOutcome, error) {
	query := `
	SELECT
		c.id AS candidatoid,
		com.id AS comunaid,
		e.id AS eleccionid,
		SUM(vm.votos) AS votos
	FROM votos_mesa vm
		LEFT JOIN mesa me ON vm.mesa_id = me.id
		LEFT JOIN candidatura can ON vm.candidatura_id = can.id
		LEFT JOIN candidato c ON can.candidato_id = c.id
		LEFT JOIN eleccion e ON can.eleccion_id = e.id
		LEFT JOIN tipo_eleccion te ON e.tipo_eleccion_id = te.id
		LEFT JOIN partido pa ON can.partido_id = pa.id
		LEFT JOIN comuna com ON me.comuna_id = com.id
		LEFT JOIN region re ON com.region_id = re.id
	WHERE
		(e.id = :eleccionID)
		AND (c.id = :candidatoID)
		AND (com.id IN (:comunaIDs))
	GROUP BY c.id, com.id, e.id;`

	params := map[string]interface{}{
		"eleccionID": electionID,
		"candidatoID": candidateID,
		"comunaIDs": comunaIDs,
	}
	query, args, err := sqlx.Named(query, params)
	if err != nil {
		return nil, err
	}

	query, args, err = sqlx.In(query, args...)
	if err != nil {
		return nil, err
	}

	outcome := []ElectionOutcome{}
	err = db.Select(&outcome, db.Rebind(query), args...)	
	return outcome, err
}
