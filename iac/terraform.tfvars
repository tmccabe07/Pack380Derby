# Example values for variables - DO NOT commit this file with sensitive information
aws_region = "us-east-1"
project_name = "pack380derby"

# Existing Network IDs
vpc_id = "vpc-0a1986e634e837a76"              # Replace with your VPC ID
public_subnet_id = "subnet-0c1ea18ea909f5652"  # Replace with your public subnet ID
private_subnet_1_id = "subnet-0c1ea18ea909f5652" # Replace with your first private subnet ID
private_subnet_2_id = "subnet-0b1255f811b8911a9" # Replace with your second private subnet ID

# Database configuration
db_instance_class = "db.t4g.micro"
db_name = "Pack380Derby"
db_username = "postgres"     # Change this
db_password = "adminadmin"     # Change this

# EC2 configuration
ami_id = "ami-08982f1c5bf93d976"  # Amazon Linux 2023 AMI in us-east-1
instance_type = "t3.micro"
key_name = "derby"        # Change this to your existing key pair name