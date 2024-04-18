package repository

import (
	"context"
	"database/sql"
	"time"
)

type EventRepository struct {
	db *sql.DB
}

func NewEventRepository(db *sql.DB) *EventRepository {
	return &EventRepository{db: db}
}

type Event struct {
	ID        int       `json:"id"`
	ProjectID int       `json:"projectId"`
	Name      string    `json:"name"`
	Page      string    `json:"page"`
	CreatedAt time.Time `json:"createdAt"`
}

func (r *EventRepository) GetByProjectID(ctx context.Context, projectID int) ([]*Event, error) {
	query := "SELECT id, project_id, name, page FROM events WHERE project_id = $1"

	rows, err := r.db.QueryContext(ctx, query, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []*Event

	for rows.Next() {
		var event Event

		err := rows.Scan(&event.ID, &event.ProjectID, &event.Name, &event.Page)
		if err != nil {
			return nil, err
		}

		events = append(events, &event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(events) == 0 {
		return []*Event{}, nil
	}

	return events, nil
}

func (r *EventRepository) Create(ctx context.Context, event *Event) error {
	query := "INSERT INTO events (project_id, name, page) VALUES ($1, $2, $3)"

	_, err := r.db.ExecContext(ctx, query, event.ProjectID, event.Name, event.Page)
	if err != nil {
		return err
	}

	return nil
}
