
serial::Serial my_serial;
void process_stream_data(const sensor_msgs::LaserScan msg)
{
	ROS_INFO(msg->data);
}

int stream_data(serial::Serial _serial)
{	
	my_serial = _serial
	ros::init( null, null, "stream_listener");
	ros::NodeHandle n;
	ros::Subscriber stream_subscriber = n.subscribe("sensor_msgs/LaserScan", 1, process_stream_data);
	ros::spin()
}