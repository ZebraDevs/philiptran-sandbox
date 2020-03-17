
#include <iostream>
#include <string>

// third party 
#include "serial/serial.h"
#include <sensor_msgs/LaserScan.h>
#include "ros/ros.h"

using std::vector;
using std::string;
using std::cout;


serial::Serial my_serial("/dev/ttyUSB0", 460800, serial::Timeout::simpleTimeout(250));

void process_stream_data(const sensor_msgs::LaserScan::ConstPtr& scan)
{
	my_serial.write("(");
	for(int i = 0; i < 622; i++) {
		my_serial.write(std::to_string(scan->ranges[i]) + ',');

	}
	my_serial.write(")p");
	string s; 
	my_serial.readline(s);
	cout <<s << "\n";
}


int main(int argc, char** argv) {
	
	ROS_INFO("listening in!");
	ros::init(argc, argv, "stream_listener");
	ros::NodeHandle n; 
	ros::Subscriber stream_subscriber = n.subscribe<sensor_msgs::LaserScan>("/base_scan", 1, process_stream_data);
	ros::spin();
}