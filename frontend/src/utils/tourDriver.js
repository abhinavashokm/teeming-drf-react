import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import store from "../store/store";
import { skipTour } from '../store/slices/tourSlice';

export const tourDriver = driver({
  showProgress: false,
  allowClose: false,   // ← overlay clicks no longer close the tour
  onCloseClick: () => {
    cancelPendingDrive();      // kill any in-flight poll immediately
    store.dispatch(skipTour());
    tourDriver.destroy();
    // TODO: call your completeTour mutation here too, so it doesn't nag again
  },
});

let pollTimer = null;

export function cancelPendingDrive() {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
}


export const driveWhenReady = (selector, popoverConfig, maxAttempts = 20, interval = 150) => {
  cancelPendingDrive(); // always clear any previous pending poll before starting a new one

  let attempts = 0;

  const tryDrive = () => {
    // re-check tour is still active before every attempt — covers the "user closed it mid-poll" case
    if (!store.getState().tour.active) return;

    const el = document.querySelector(selector);
    if (el) {
      tourDriver.destroy(); // clear any existing overlay/popover before showing the new one
      tourDriver.setSteps([{ element: selector, popover: popoverConfig }]);
      tourDriver.drive();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryDrive, interval);
    }
    // if maxAttempts exceeded, silently give up — better than an infinite loop or a crash
  };
  tryDrive();
}

//helper to resume tour if user accidently skip the tour by closing a form modal or etc
export function resumeStepIfActive(expectedStep, selector, popoverConfig) {
    const { active, stepIndex } = store.getState().tour;
    if (active && stepIndex === expectedStep) {
        driveWhenReady(selector, popoverConfig);
    }
}