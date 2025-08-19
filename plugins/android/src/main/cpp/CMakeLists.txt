find_package(react-native-vision-camera REQUIRED CONFIG)
# ...
target_link_libraries(
  ${PACKAGE_NAME}
  # ... other libs
  react-native-vision-camera::VisionCamera
)