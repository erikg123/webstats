package repository

import (
	"context"
	"database/sql"
)

type ProjectRepository struct {
	db *sql.DB
}

func NewProjectRepository(db *sql.DB) *ProjectRepository {
	return &ProjectRepository{db: db}
}

type Project struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (r *ProjectRepository) Create(ctx context.Context, project *Project) error {
	query := "INSERT INTO projects (name) VALUES (?)"
	_, err := r.db.ExecContext(ctx, query, project.Name)

	if err != nil {
		return err
	}
	return nil
}

func (r *ProjectRepository) GetAll(ctx context.Context) ([]*Project, error) {
	query := "SELECT id, name FROM projects"
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []*Project
	for rows.Next() {
		var project Project
		err := rows.Scan(&project.ID, &project.Name)
		if err != nil {
			return nil, err
		}
		projects = append(projects, &project)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(projects) == 0 {
		return []*Project{}, nil
	}

	return projects, nil
}
