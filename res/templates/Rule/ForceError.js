export default function ForceError(clientAPI) {
  setTimeout(() => {
    clientAPI.thisReallyIsntAmethod();
  }, 500);
}