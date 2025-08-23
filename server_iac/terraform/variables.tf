variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "pack380-derby"
}

variable "environment" {
  description = "Environment (e.g., dev, prod)"
  type        = string
  default     = "dev"
}
