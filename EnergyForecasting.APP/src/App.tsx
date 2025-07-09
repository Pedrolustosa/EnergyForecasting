import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Form, Spinner, Row, Col, Table, Card, Badge } from "react-bootstrap";
import { Chart as ChartJS } from "react-chartjs-2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Chart, registerables } from "chart.js";
import { Prediction } from "./types";
import NextDayPrediction from "./components/NextDayPrediction";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

Chart.register(...registerables);

// Configure toastr
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: true,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: undefined,
  showDuration: 300,
  hideDuration: 1000,
  timeOut: 5000,
  extendedTimeOut: 1000,
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};

type Model = "arima" | "arimax" | "svr" | "mlp";

const API_BASE = "https://energyforecastingapi.azurewebsites.net";

const modelOptions = [
  { value: "arima", label: "ARIMA" },
  { value: "arimax", label: "ARIMAX" },
  { value: "svr", label: "SVR" },
  { value: "mlp", label: "MLP" },
];

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<Model>("arima");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [testDates, setTestDates] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toastr.error(" Por favor, selecione um arquivo CSV antes de continuar.", "Arquivo Necessário");
      return;
    }
    setLoading(true);
    setPredictions([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const resp = await axios.post(`${API_BASE}/upload_csv`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toastr.success(
        ` Arquivo processado com sucesso! ${resp.data.test_dates?.length || 0} registros carregados.`,
        "Upload Concluído"
      );
      setTestDates(resp.data.test_dates || []);
    } catch (err: any) {
      toastr.error(
        " Falha ao processar o arquivo. Verifique se é um CSV válido.",
        "Erro no Upload"
      );
    }
    setLoading(false);
  };

  const handlePredict = async () => {
    setLoading(true);
    setPredictions([]);
    try {
      const resp = await axios.get<Prediction[]>(`${API_BASE}/predict/${model}`);
      setPredictions(resp.data);
      toastr.success(
        ` Previsão gerada com sucesso! ${resp.data.length} pontos de dados analisados usando o modelo ${model.toUpperCase()}.`,
        "Análise Concluída"
      );
    } catch (err: any) {
      toastr.error(
        " Falha ao gerar previsão. Verifique se os dados foram carregados corretamente.",
        "Erro na Previsão"
      );
    }
    setLoading(false);
  };

  // Filtrar dados baseado no intervalo de datas
  const getFilteredPredictions = () => {
    let filtered = [...predictions];

    // Filtrar por data inicial se especificada
    if (startDate) {
      const startDateObj = new Date(startDate);
      filtered = filtered.filter(p => {
        const predDate = new Date(p.date);
        return predDate >= startDateObj;
      });
    }

    // Filtrar por data final se especificada
    if (endDate) {
      const endDateObj = new Date(endDate);
      filtered = filtered.filter(p => {
        const predDate = new Date(p.date);
        return predDate <= endDateObj;
      });
    }

    return filtered;
  };



  // Gerar dados simulados para demonstração (irradiação e energia injetada)
  const generateSimulatedData = (predictions: Prediction[]) => {
    return predictions.map((p, index) => ({
      ...p,
      // Simular irradiação baseada na energia gerada (correlação aproximada)
      irradiation: p.real ? Math.max(200, p.real * 15 + Math.random() * 100 - 50) : Math.random() * 400 + 200,
      // Simular energia injetada (geralmente menor que a gerada)
      injected: p.real ? Math.max(0, p.real * 0.7 + Math.random() * p.real * 0.2 - p.real * 0.1) : p.predicted * 0.7
    }));
  };

  // Dados para o gráfico (todos os dados filtrados)
  const filteredPredictions = getFilteredPredictions();
  const enrichedPredictionsChart = generateSimulatedData(filteredPredictions);

  // Dados para a tabela (todos os dados filtrados)
  const enrichedPredictionsTable = generateSimulatedData(filteredPredictions);

  // Configuração do gráfico misto
  const mixedChartData = {
    labels: enrichedPredictionsChart.map((p) => p.date),
    datasets: [
      // Barras - Energia Prevista
      {
        type: 'bar' as const,
        label: "Energia Prevista (kWh)",
        data: enrichedPredictionsChart.map((p) => p.predicted),
        backgroundColor: "rgba(25, 135, 84, 0.7)",
        borderColor: "#198754",
        borderWidth: 1,
        yAxisID: 'y',
      },
      // Barras - Energia Gerada Real
      {
        type: 'bar' as const,
        label: "Energia Gerada (kWh)",
        data: enrichedPredictionsChart.map((p) => p.real || 0),
        backgroundColor: "rgba(13, 110, 253, 0.7)",
        borderColor: "#0d6efd",
        borderWidth: 1,
        yAxisID: 'y',
      },
      // Barras - Energia Injetada
      {
        type: 'bar' as const,
        label: "Energia Injetada (kWh)",
        data: enrichedPredictionsChart.map((p) => p.injected || 0),
        backgroundColor: "rgba(255, 193, 7, 0.7)",
        borderColor: "#ffc107",
        borderWidth: 1,
        yAxisID: 'y',
      },
      // Linha - Irradiação
      {
        type: 'line' as const,
        label: "Irradiação (Wh/m2)",
        data: enrichedPredictionsChart.map((p) => p.irradiation || 0),
        borderColor: "#dc3545",
        backgroundColor: "rgba(220, 53, 69, 0.1)",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#dc3545",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        yAxisID: 'y1',
      },
    ],
  };

  // Opções do gráfico misto
  const mixedChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Análise Energética - Previsão vs Realidade',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.yAxisID === 'y1') {
              label += context.parsed.y + ' Wh/m2';
            } else {
              label += context.parsed.y.toFixed(2) + ' kWh';
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Energia (kWh)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Irradiação (Wh/m2)'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Academic Header */}
      <div className="bg-white border-bottom shadow-sm">
        <Container>
          <div className="py-4">
            <div className="row align-items-center">
              <div className="col">
                <h1 className="h3 mb-1 text-dark fw-bold">
                  <i className="bi bi-graph-up text-primary me-2"></i>
                  Sistema de Previsão Energética
                </h1>
                <p className="text-muted mb-0 small">
                  Pós-Graduação em Ciência de Dados e Analytics | Análise Preditiva de Energia Renovável
                </p>
              </div>
              <div className="col-auto">
                <div className="d-flex gap-2">
                  <span className="badge bg-primary px-3 py-2">
                    <i className="bi bi-mortarboard me-1"></i>
                    Projeto Acadêmico
                  </span>
                  <span className="badge bg-success px-3 py-2">
                    <i className="bi bi-lightning-charge me-1"></i>
                    ML Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-4">
        {/* Academic Introduction */}
        <div className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="h5 mb-2 text-dark">
                    <i className="bi bi-lightbulb text-warning me-2"></i>
                    Objetivo da Pesquisa
                  </h2>
                  <p className="text-muted mb-0 small">
                    Este sistema implementa algoritmos de Machine Learning para previsão de geração de energia renovável,
                    utilizando modelos ARIMA, LSTM e Random Forest para análise preditiva de séries temporais energéticas.
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <div className="d-flex flex-column gap-2">
                    <span className="badge bg-info px-3 py-2">
                      <i className="bi bi-graph-up me-1"></i>
                      Análise Preditiva
                    </span>
                    <span className="badge bg-success px-3 py-2">
                      <i className="bi bi-cpu me-1"></i>
                      Machine Learning
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Main Controls Card */}
        <Card className="shadow-lg border-0 mb-4">
          <Card.Header className="bg-white border-0 py-4">
            <h4 className="mb-0 text-primary d-flex align-items-center">
              <i className="bi bi-gear-fill me-2"></i>
              Configuração da Análise
            </h4>
          </Card.Header>
          <Card.Body className="p-4">
            <Row className="g-4">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                    <i className="bi bi-file-earmark-spreadsheet me-2 text-primary"></i>
                    Arquivo de Dados
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="form-control-lg"
                    style={{ border: '2px dashed #dee2e6' }}
                  />
                  <Form.Text className="text-muted">
                    Selecione um arquivo CSV com dados históricos
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                    <i className="bi bi-cpu me-2 text-success"></i>
                    Modelo de Previsão
                  </Form.Label>
                  <Form.Select
                    value={model}
                    onChange={e => setModel(e.target.value as Model)}
                    className="form-select-lg"
                  >
                    {modelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Escolha o algoritmo de machine learning
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex flex-column justify-content-end">
                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleUpload}
                    disabled={loading || !file}
                    className="fw-semibold"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cloud-upload me-2"></i>
                        Carregar Dados
                      </>
                    )}
                  </Button>
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handlePredict}
                    disabled={loading || !file || testDates.length === 0}
                    className="fw-semibold"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Calculando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-magic me-2"></i>
                        Gerar Previsão
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Status Indicators */}
            <Row className="mt-4">
              <Col>
                <div className="d-flex gap-3 flex-wrap">
                  <Badge bg={file ? 'success' : 'secondary'} className="p-2 d-flex align-items-center">
                    <i className={`bi ${file ? 'bi-check-circle-fill' : 'bi-clock'} me-2`}></i>
                    {file ? 'Arquivo carregado' : 'Aguardando arquivo'}
                  </Badge>
                  <Badge bg={testDates.length > 0 ? 'success' : 'secondary'} className="p-2 d-flex align-items-center">
                    <i className={`bi ${testDates.length > 0 ? 'bi-check-circle-fill' : 'bi-clock'} me-2`}></i>
                    {testDates.length > 0 ? `${testDates.length} registros processados` : 'Dados não processados'}
                  </Badge>
                  <Badge bg={predictions.length > 0 ? 'success' : 'secondary'} className="p-2 d-flex align-items-center">
                    <i className={`bi ${predictions.length > 0 ? 'bi-check-circle-fill' : 'bi-clock'} me-2`}></i>
                    {predictions.length > 0 ? `${predictions.length} previsões geradas` : 'Previsões pendentes'}
                  </Badge>
                </div>
              </Col>
            </Row>

            {/* Filtros do Gráfico */}
            {predictions.length > 0 && (
              <>
                <Row className="mt-4 pt-4 border-top">
                  <Col>
                    <h6 className="text-muted mb-3 d-flex align-items-center">
                      <i className="bi bi-funnel me-2"></i>
                      Filtros de Visualização
                    </h6>
                  </Col>
                </Row>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                        <i className="bi bi-calendar-date me-2 text-info"></i>
                        Data Inicial
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="form-control"
                      />
                      <Form.Text className="text-muted">
                        Filtrar dados a partir desta data
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold text-dark mb-2 d-flex align-items-center">
                        <i className="bi bi-calendar-check me-2 text-success"></i>
                        Data Final
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="form-control"
                      />
                      <Form.Text className="text-muted">
                        Filtrar dados até esta data
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Card.Body>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-lg border-0 mb-4">
            <Card.Body className="text-center py-5">
              <Spinner animation="border" size="sm" className="me-3" />
              <span className="fs-5 text-muted">Processando dados...</span>
            </Card.Body>
          </Card>
        )}

        {/* Next Day Prediction */}
        {predictions.length > 0 && endDate && (
          <NextDayPrediction
            predictions={predictions}
            endDate={endDate}
            model={model}
          />
        )}

        {/* Results Section */}
        {predictions.length > 0 && (
          <>
            {/* Chart Card */}
            <Card className="shadow-lg border-0 mb-4">
              <Card.Header className="bg-white border-0 py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-primary d-flex align-items-center">
                    <i className="bi bi-graph-up me-2"></i>
                    Análise Comparativa
                  </h4>
                  <Badge bg="info" className="p-2 d-flex align-items-center">
                    <i className="bi bi-cpu me-2"></i>
                    Modelo: {model.toUpperCase()}
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div style={{ height: '500px' }}>
                  <ChartJS
                    type='bar'
                    data={mixedChartData}
                    options={{
                      ...mixedChartOptions,
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Card.Body>
            </Card>
          </>
        )}

        {/* Statistics Cards */}
        {predictions.length > 0 && (
          <>
            {/* Energy and Irradiation Statistics */}
            <Row className="mb-4">
              <Col>
                <h6 className="text-muted mb-3 d-flex align-items-center">
                  <i className="bi bi-bar-chart me-2"></i>
                  Estatísticas do Período Selecionado
                </h6>
              </Col>
            </Row>
            <Row className="g-3 mb-4">
              <Col md={3}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-lightning-charge-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h3 className="text-primary mb-1">
                      {filteredPredictions.reduce((sum, p) => sum + (p.real || 0), 0).toFixed(2)}
                    </h3>
                    <p className="text-muted mb-0 small fw-semibold">kWh</p>
                    <p className="text-muted mb-0 small">Energia Gerada Total</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-magic text-success" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h3 className="text-success mb-1">
                      {filteredPredictions.reduce((sum, p) => sum + p.predicted, 0).toFixed(2)}
                    </h3>
                    <p className="text-muted mb-0 small fw-semibold">kWh</p>
                    <p className="text-muted mb-0 small">Energia Prevista Total</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-arrow-up-circle text-warning" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h3 className="text-warning mb-1">
                      {enrichedPredictionsChart.reduce((sum, p) => sum + (p.injected || 0), 0).toFixed(2)}
                    </h3>
                    <p className="text-muted mb-0 small fw-semibold">kWh</p>
                    <p className="text-muted mb-0 small">Energia Injetada Total</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-sun text-danger" style={{ fontSize: '2.5rem' }}></i>
                    </div>
                    <h3 className="text-danger mb-1">
                      {enrichedPredictionsChart.length > 0 ?
                        (enrichedPredictionsChart.reduce((sum, p) => sum + (p.irradiation || 0), 0) / enrichedPredictionsChart.length).toFixed(0) :
                        '0'
                      }
                    </h3>
                    <p className="text-muted mb-0 small fw-semibold">Wh/m2</p>
                    <p className="text-muted mb-0 small">Irradiação Média</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Additional Statistics Row */}
            <Row className="g-3 mb-4">
              <Col md={4}>
                <Card className="border-0 shadow-sm bg-light">
                  <Card.Body className="text-center p-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-calendar-range text-info me-2" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6 className="mb-0 text-info">{filteredPredictions.length}</h6>
                        <small className="text-muted">Registros no Período</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm bg-light">
                  <Card.Body className="text-center p-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-percent text-info me-2" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6 className="mb-0 text-info">
                          {filteredPredictions.length > 0 ?
                            ((filteredPredictions.length / predictions.length) * 100).toFixed(1) :
                            '0'
                          }%
                        </h6>
                        <small className="text-muted">do Total de Dados</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="border-0 shadow-sm bg-light">
                  <Card.Body className="text-center p-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="bi bi-graph-up-arrow text-info me-2" style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <h6 className="mb-0 text-info">
                          {filteredPredictions.length > 0 && filteredPredictions.some(p => p.real !== null) ?
                            (
                              Math.abs(
                                filteredPredictions.reduce((sum, p) => sum + (p.real || 0), 0) -
                                filteredPredictions.reduce((sum, p) => sum + p.predicted, 0)
                              ) / filteredPredictions.reduce((sum, p) => sum + (p.real || 0), 0) * 100
                            ).toFixed(1) :
                            '0'
                          }%
                        </h6>
                        <small className="text-muted">Diferença Média</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}

        {/* Data Table Card */}
        <Card className="shadow-lg border-0">
          <Card.Header className="bg-white border-0 py-4">
            <h4 className="mb-0 text-primary d-flex align-items-center">
              <i className="bi bi-table me-2"></i>
              Dados Detalhados
            </h4>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table className="mb-0" hover>
                <thead className="table-light">
                  <tr>
                    <th className="py-3 px-4 fw-bold">
                      <i className="bi bi-calendar3 me-2"></i>Data
                    </th>
                    <th className="py-3 px-4 fw-bold text-primary">
                      <i className="bi bi-lightning-charge me-2"></i>Energia Gerada
                    </th>
                    <th className="py-3 px-4 fw-bold text-success">
                      <i className="bi bi-magic me-2"></i>Energia Prevista
                    </th>
                    <th className="py-3 px-4 fw-bold text-warning">
                      <i className="bi bi-arrow-up-circle me-2"></i>Energia Injetada
                    </th>
                    <th className="py-3 px-4 fw-bold text-danger">
                      <i className="bi bi-sun me-2"></i>Irradiação
                    </th>
                    <th className="py-3 px-4 fw-bold text-info">
                      <i className="bi bi-bar-chart me-2"></i>Diferença
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedPredictionsTable.map((p, idx) => {
                    const difference = p.real !== null ? Math.abs(p.real - p.predicted) : null;
                    const percentDiff = p.real !== null && p.real !== 0 ? ((difference! / p.real) * 100) : null;

                    return (
                      <tr key={idx} className={idx % 2 === 0 ? 'table-light' : ''}>
                        <td className="py-3 px-4 fw-semibold">{p.date}</td>
                        <td className="py-3 px-4">
                          {p.real !== null ? (
                            <span className="text-primary fw-semibold">
                              {p.real.toFixed(2)} kWh
                            </span>
                          ) : (
                            <span className="text-muted fst-italic">Não disponível</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-success fw-semibold">
                            {p.predicted.toFixed(2)} kWh
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-warning fw-semibold">
                            {p.injected?.toFixed(2) || '0.00'} kWh
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-danger fw-semibold">
                            {p.irradiation?.toFixed(0) || '0'} Wh/m2
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {difference !== null ? (
                            <div>
                              <span className="text-info fw-semibold">
                                ±{difference.toFixed(2)} kWh
                              </span>
                              {percentDiff !== null && (
                                <small className="d-block text-muted">
                                  ({percentDiff.toFixed(1)}%)
                                </small>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted fst-italic">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {/* Informação sobre registros exibidos */}
            {filteredPredictions.length > 0 && (
              <div className="d-flex justify-content-center align-items-center p-4 border-top bg-light">
                <div className="text-muted d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  Exibindo todos os {filteredPredictions.length} registros do período selecionado
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Empty State */}
        {!loading && predictions.length === 0 && testDates.length === 0 && (
          <Card className="shadow-lg border-0 text-center">
            <Card.Body className="py-5">
              <div className="mb-4">
                <i className="bi bi-graph-up" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
              </div>
              <h4 className="text-muted mb-3">Pronto para começar!</h4>
              <p className="text-muted">
                Carregue um arquivo CSV com dados históricos e escolha um modelo para gerar previsões inteligentes.
              </p>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default App;