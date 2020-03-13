// this ros node will handle streaming the laser data to our javascript front-end


// first party
#include <iostream>
#include <string> // stoi

// third party 
#include "serial/serial.h"
#include "ros/ros.h"
#include "sensor_msgs/LaserScan.h"


int stream_data(serial::Serial _serial);
void process_stream_data(const sensor_msgs::LaserScan msg);