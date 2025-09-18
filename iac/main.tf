terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_vpc" "existing_vpc" {
  id = var.vpc_id
}

data "aws_subnet" "public_subnet" {
  id = var.public_subnet_id
}

data "aws_subnet" "private_subnet_1" {
  id = var.private_subnet_1_id
}

data "aws_subnet" "private_subnet_2" {
  id = var.private_subnet_2_id
}

# Create security group for EC2
resource "aws_security_group" "ec2_sg" {
  name        = "${var.project_name}-ec2-sg"
  description = "Security group for EC2 instance"
  vpc_id      = data.aws_vpc.existing_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 3000
    to_port = 3000
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}

# Create security group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = data.aws_vpc.existing_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# Create DB subnet group
resource "aws_db_subnet_group" "derby_db_subnet_group" {
  name       = "${var.project_name}-db-subnet-group"
  subnet_ids = [data.aws_subnet.private_subnet_1.id, data.aws_subnet.private_subnet_2.id]

  tags = {
    Name = "${var.project_name}-db-subnet-group"
  }
}

# Create RDS instance
resource "aws_db_instance" "derby_db" {
  identifier           = "${var.project_name}-db"
  engine              = "postgres"
  engine_version      = "17.6"
  instance_class      = var.db_instance_class
  allocated_storage   = 20
  storage_type        = "gp2"

  db_name             = var.db_name
  username           = var.db_username
  password           = var.db_password

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.derby_db_subnet_group.name

  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = {
    Name = "${var.project_name}-db"
  }
}

# Create EC2 instance
resource "aws_instance" "derby_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = data.aws_subnet.public_subnet.id
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
  key_name              = var.key_name

  root_block_device {
    volume_size = 20
    volume_type = "gp2"
  }

  tags = {
    Name = "${var.project_name}-server"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo yum -y install nodejs npm git
              git clone https://github.com/tmccabe07/Pack380Derby.git
              echo "export DB_HOST=${aws_db_instance.derby_db.endpoint}" >> /etc/environment
              echo "export DB_NAME=${var.db_name}" >> /etc/environment
              echo "export DB_USER=${var.db_username}" >> /etc/environment
              echo "export DB_PASSWORD=${var.db_password}" >> /etc/environment
              EOF
}

# Output the connection information
output "ec2_public_ip" {
  value = aws_instance.derby_server.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.derby_db.endpoint
}