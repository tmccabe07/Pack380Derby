# AWS Region
aws_region = "us-east-1"

# Project and Environment
project_name = "pack380-derby"
environment  = "dev"

# VPC Configuration
vpc_id             = "vpc-0a1986e634e837a76" # Replace with your VPC ID 
private_subnet_ids = [
  "subnet-0c1ea18ea909f5652", # Replace with your first private subnet ID
  "subnet-0b1255f811b8911a9"  # Replace with your second private subnet ID
]

# EC2 Configuration
instance_type    = "t2.nano"
app_port        = 3000
public_subnet_id = "subnet-08293858db9bd03ed"    # Replace with your public subnet ID

# RDS Configuration
db_instance_class = "db.t3.micro"
db_name          = "pack380derby"
db_username      = "derbyadmin"
# db_password    = "your-secure-password" # Set this via environment variable TF_VAR_db_password instead
