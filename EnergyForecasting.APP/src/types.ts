export type Prediction = {
    date: string;
    real: number | null; // Energia gerada real
    predicted: number; // Energia prevista
    injected?: number; // Energia injetada na rede
    irradiation?: number; // Irradiação solar (W/m²)
  };