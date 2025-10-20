/**
 * Navigation Handlers for routing and page transitions
 * These handlers manage navigation between different views in the application
 */

export const handleEnterPlayground = (navigate) => () => {
  console.log("handleEnter called");
  console.log("Attempting to navigate to /playground");
  navigate("/playground");
  console.log("navigate() executed");
};
