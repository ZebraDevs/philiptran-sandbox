// first party
#include <iostream>
#include <string> // stoi
#include <unistd.h> //sleep
#include <cstdint> //uint8

// third party 
#include "serial/serial.h"
#include "ros/ros.h"
#include <geometry_msgs/Twist.h>
#include "laser_data_stream.h"

using std::vector;
using std::string;
using std::cout;


ros::Publisher movement_publisher;
serial::Serial my_serial;


void process_stream_data(sensor_msgs::LaserScan data)
{
	return ;
}

int stream_data()
{	
	ros::NodeHandle n;
	ros::Subscriber stream_subscriber = n.subscribe("sensor_msgs/LaserScan", 1, process_stream_data);
	ros::spin();
}


int main(int argc, char** argv) {
	my_serial = serial::Serial("/dev/ttyUSB0", 460800, serial::Timeout::simpleTimeout(1000));
	ros::init(argc, argv, "serial_listener");
	ros::NodeHandle n;
	movement_publisher = n.advertise<geometry_msgs::Twist>("/cmd_vel", 1);
	bool robot_moving = false;
	uint8_t  code = 0;
	while(ros::ok()) {
		my_serial.read(&code, 1);
		cout << "CODE IS : " << code << "\n";

		if(code == 1) {
			geometry_msgs::Twist t;
			t.linear.x = 1;
			movement_publisher.publish(t);
			robot_moving = true;
		}
		else if(code == 2) {
			geometry_msgs::Twist t;
			t.angular.z = 1;
			movement_publisher.publish(t);
			robot_moving = true;
		}
		else if(code == 3) {
			geometry_msgs::Twist t;
			t.angular.z = -1;
			movement_publisher.publish(t);
			robot_moving = true;
		}
		else if(code == 0 && robot_moving) {
			geometry_msgs::Twist t;
			movement_publisher.publish(t);
			robot_moving = false;
		}

	}
}