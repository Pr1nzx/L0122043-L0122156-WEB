export async function sendStepData(step, data) {
  console.log("SEND TO BACKEND:", { step, data });

  // simulasi response ontology backend
  return {
    decision: step < 4 ? "NEXT" : "STOP",
    message: "Ontology reasoning executed successfully",
  };
}
