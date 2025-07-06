import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Form, Spinner, Row, Col, Table, Card, Alert, Badge, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { Chart, registerables } from "chart.js";
import { Prediction } from "./types";
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

const API_BASE = "http://127.0.0.1:8000";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toastr.error("📁 Por favor, selecione um arquivo CSV antes de continuar.", "Arquivo Necessário");
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
        `✅ Arquivo processado com sucesso! ${resp.data.test_dates?.length || 0} registros carregados.`,
        "Upload Concluído"
      );
      setTestDates(resp.data.test_dates || []);
    } catch (err: any) {
      toastr.error(
        "❌ Falha ao processar o arquivo. Verifique se é um CSV válido.",
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
        `🔮 Previsão gerada com sucesso! ${resp.data.length} pontos de dados analisados usando o modelo ${model.toUpperCase()}.`,
        "Análise Concluída"
      );
    } catch (err: any) {
      toastr.error(
        "❌ Falha ao gerar previsão. Verifique se os dados foram carregados corretamente.",
        "Erro na Previsão"
      );
    }
    setLoading(false);
  };

  // Data for Chart.js with improved styling
  const chartData = {
    labels: predictions.map((p) => p.date),
    datasets: [
      {
        label: "Valores Reais",
        data: predictions.map((p) => p.real),
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.1)",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#0d6efd",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
      {
        label: "Valores Previstos",
        data: predictions.map((p) => p.predicted),
        borderColor: "#198754",
        backgroundColor: "rgba(25, 135, 84, 0.1)",
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#198754",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Navigation Bar */}
      <Navbar className="navbar-custom shadow-sm" expand="lg">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <img
              src="/logo_sun.png"
              alt="Energy Prediction Logo"
              height="40"
              className="me-3"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
            />
            <div>
              <span className="fw-bold text-white fs-4">Energy Forecast</span>
              <div className="small text-white-50">
                <i className="bi bi-lightning-charge me-1"></i>
                Sistema de Previsão Inteligente
              </div>
            </div>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
            <i className="bi bi-list text-white fs-4"></i>
          </Navbar.Toggle>
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Item className="me-3">
                <div className="d-flex align-items-center text-white-50">
                  <i className="bi bi-database me-2"></i>
                  <span className="small">
                    {testDates.length > 0 ? `${testDates.length} registros` : 'Sem dados'}
                  </span>
                </div>
              </Nav.Item>
              
              <Nav.Item className="me-3">
                <div className="d-flex align-items-center text-white-50">
                  <i className="bi bi-graph-up me-2"></i>
                  <span className="small">
                    {predictions.length > 0 ? `${predictions.length} previsões` : 'Sem previsões'}
                  </span>
                </div>
              </Nav.Item>
              
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-light" 
                  id="dropdown-basic"
                  className="border-0 d-flex align-items-center"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <i className="bi bi-gear me-2"></i>
                  <span className="d-none d-md-inline">Opções</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="shadow border-0">
                  <Dropdown.Item href="#" className="d-flex align-items-center">
                    <i className="bi bi-info-circle me-2 text-primary"></i>
                    Sobre o Sistema
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="d-flex align-items-center">
                    <i className="bi bi-question-circle me-2 text-success"></i>
                    Ajuda
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#" className="d-flex align-items-center">
                    <i className="bi bi-download me-2 text-info"></i>
                    Exportar Dados
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="d-flex align-items-center">
                    <i className="bi bi-arrow-clockwise me-2 text-warning"></i>
                    Limpar Cache
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="py-5" style={{ maxWidth: 1200 }}>
        {/* Header */}
        <div className="text-center mb-5">
          <p className="lead text-white mb-4" style={{ fontSize: '1.25rem' }}>
            Sistema inteligente de previsão de geração de energia usando modelos de Machine Learning
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Badge bg="primary" className="px-3 py-2 d-flex align-items-center">
              <i className="bi bi-robot me-2"></i>
              IA Avançada
            </Badge>
            <Badge bg="success" className="px-3 py-2 d-flex align-items-center">
              <i className="bi bi-graph-up-arrow me-2"></i>
              Análise Precisa
            </Badge>
            <Badge bg="info" className="px-3 py-2 d-flex align-items-center">
              <i className="bi bi-lightning-charge me-2"></i>
              Energia Renovável
            </Badge>
          </div>
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
                <div style={{ height: '400px' }}>
                  <Line
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: { 
                          display: true, 
                          text: `Comparação: Valores Reais vs Previstos`,
                          font: { size: 16, weight: 'bold' }
                        },
                        legend: {
                          position: 'top',
                          labels: { usePointStyle: true, padding: 20 }
                        }
                      },
                      scales: {
                        x: { 
                          title: { display: true, text: 'Período', font: { weight: 'bold' } },
                          grid: { color: 'rgba(0,0,0,0.1)' }
                        },
                        y: { 
                          title: { display: true, text: 'Energia Gerada (kWh)', font: { weight: 'bold' } },
                          grid: { color: 'rgba(0,0,0,0.1)' }
                        },
                      },
                      elements: {
                        point: { radius: 4, hoverRadius: 6 },
                        line: { borderWidth: 3 }
                      }
                    }}
                  />
                </div>
              </Card.Body>
            </Card>

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
                          <i className="bi bi-lightning-charge me-2"></i>Valor Real
                        </th>
                        <th className="py-3 px-4 fw-bold text-success">
                          <i className="bi bi-magic me-2"></i>Valor Previsto
                        </th>
                        <th className="py-3 px-4 fw-bold text-warning">
                          <i className="bi bi-bar-chart me-2"></i>Diferença
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictions.map((p, idx) => {
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
                              {difference !== null ? (
                                <div>
                                  <span className="text-warning fw-semibold">
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
              </Card.Body>
            </Card>
          </>
        )}

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