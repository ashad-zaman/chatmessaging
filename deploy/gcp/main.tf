terraform {
  required_version = ">= 1.0"
  
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.gcp_region
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "gcp_region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "database_tier" {
  description = "Cloud SQL tier"
  type        = string
  default     = "db-f1-micro"
}

variable "redis_tier" {
  description = "Memorystore tier"
  type        = string
  default     = "BASIC"
}

variable "redis_capacity" {
  description = "Memorystore capacity in GB"
  type        = number
  default     = 1
}

variable "cloud_run_location" {
  description = "Cloud Run location"
  type        = string
  default     = "us-central1"
}

output "cloud_sql_connection_name" {
  value = google_sql_database_instance.main.connection_name
}

output "redis_host" {
  value = google_redis_instance.main.host
}

output "redis_port" {
  value = google_redis_instance.main.port
}

output "cloud_run_backend_url" {
  value = google_cloud_run_service.backend.status[0].url
}

output "cloud_run_frontend_url" {
  value = google_cloud_run_service.frontend.status[0].url
}

resource "google_project_service" "services" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "storage.googleapis.com",
    "cloudbuild.googleapis.com",
    "containerregistry.googleapis.com",
  ])
  
  service = each.value
  
  disable_on_destroy = false
}

resource "google_sql_database_instance" "main" {
  name             = "chatmessaging-db"
  database_version = "POSTGRES_15"
  region           = var.gcp_region
  
  settings {
    tier              = var.database_tier
    activation_policy = "ALWAYS"
    
    ip_configuration {
      ipv4_enabled = true
    }
  }
  
  deletion_protection = false
  
  depends_on = [google_project_service.services]
}

resource "google_sql_user" "postgres" {
  name     = "postgres"
  instance = google_sql_database_instance.main.name
  password = "change-me-in-production"
}

resource "google_redis_instance" "main" {
  name           = "chatmessaging-redis"
  tier           = var.redis_tier
  memory_size_gb = var.redis_capacity
  region         = var.gcp_region
  
  depends_on = [google_project_service.services]
}

resource "google_storage_bucket" "attachments" {
  name          = "${var.project_id}-chatmessaging-attachments"
  location     = var.gcp_region
  storage_class = "STANDARD"
  
  versioning {
    enabled = true
  }
}

resource "google_cloud_run_service" "backend" {
  name     = "chatmessaging-backend"
  location = var.cloud_run_location
  
  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/chatmessaging-backend:latest"
        
        env {
          name  = "DB_HOST"
          value = google_sql_database_instance.main.public_ip_address
        }
        
        env {
          name  = "DB_PORT"
          value = "5432"
        }
        
        env {
          name  = "DB_NAME"
          value = "chatmessaging"
        }
        
        env {
          name  = "DB_USERNAME"
          value = "postgres"
        }
        
        env {
          name  = "DB_PASSWORD"
          value = "change-me-in-production"
        }
        
        env {
          name  = "REDIS_HOST"
          value = google_redis_instance.main.host
        }
      }
    }
  }
  
  depends_on = [google_project_service.services]
}

resource "google_cloud_run_service" "frontend" {
  name     = "chatmessaging-frontend"
  location = var.cloud_run_location
  
  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/chatmessaging-frontend:latest"
        
        env {
          name  = "NEXT_PUBLIC_API_URL"
          value = google_cloud_run_service.backend.status[0].url
        }
        
        env {
          name  = "NEXT_PUBLIC_WS_URL"
          value = "${google_cloud_run_service.backend.status[0].url}/chat"
        }
      }
    }
  }
  
  depends_on = [google_project_service.services]
}

resource "google_cloud_run_service_iam_member" "backend_all_users" {
  service  = google_cloud_run_service.backend.name
  location = google_cloud_run_service.backend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "frontend_all_users" {
  service  = google_cloud_run_service.frontend.name
  location = google_cloud_run_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
