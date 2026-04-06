terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "chatmessaging"
      Environment = var.environment
    }
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

output "vpc_id" {
  value = module.vpc.vpc_id
}

output "database_endpoint" {
  value     = module.rds.db_instance_endpoint
  sensitive = true
}

output "redis_endpoint" {
  value     = module.elasticache.redis_endpoint
  sensitive = true
}

output "ecs_cluster_name" {
  value = module.ecs.cluster_name
}

output "ecs_service_name" {
  value = module.ecs.service_name
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"
  
  name = "chatmessaging-vpc"
  cidr = var.vpc_cidr
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway     = true
  single_nat_gateway     = true
  
  tags = {
    Name = "chatmessaging-vpc"
  }
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"
  
  identifier = "chatmessaging-db"
  
  engine               = "postgres"
  engine_version       = "15.3"
  instance_class       = var.db_instance_class
  allocated_storage    = var.db_allocated_storage
  max_allocated_storage = 100
  
  db_name  = "chatmessaging"
  username = "postgres"
  password = "change-me-in-production"
  
  vpc_security_group_ids = [module.security_group.rds_sg_id]
  db_subnet_group_name    = module.rds.db_subnet_group[0].name
  
  backup_retention_period = 7
  skip_final_snapshot     = true
  
  tags = {
    Name = "chatmessaging-rds"
  }
}

module "elasticache" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "~> 8.0"
  
  cluster_id = "chatmessaging-redis"
  
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = var.redis_node_type
  num_cache_nodes      = 1
  
  subnet_group_name = module.elasticache.subnet_group_name
  
  security_group_ids = [module.security_group.elasticache_sg_id]
  
  tags = {
    Name = "chatmessaging-redis"
  }
}

module "security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 5.0"
  
  name        = "chatmessaging-sg"
  description = "Security group for ChatMessaging resources"
  vpc_id      = module.vpc.vpc_id
  
  ingress_with_cidr_blocks = [
    { from_port = 3000, to_port = 3000, protocol = "tcp", cidr_blocks = "0.0.0.0/0" },
    { from_port = 3001, to_port = 3001, protocol = "tcp", cidr_blocks = "0.0.0.0/0" },
  ]
  
  egress_with_cidr_blocks = [
    { from_port = 0, to_port = 0, protocol = "-1", cidr_blocks = "0.0.0.0/0" },
  ]
}

module "ecs" {
  source = "./ecs"
  
  cluster_name = "chatmessaging-ecs"
  
  vpc_id           = module.vpc.vpc_id
  private_subnets  = module.vpc.private_subnets
  public_subnets   = module.vpc.public_subnets
  
  ecs_security_group_id = module.security_group.ecs_sg_id
  
  backend_image = "chatmessaging-backend:latest"
  frontend_image = "chatmessaging-frontend:latest"
  
  aws_region = var.aws_region
  
  db_host = module.rds.db_instance_address
  redis_host = module.elasticache.redis_cluster_nodes[0].address
  
  environment = var.environment
}
