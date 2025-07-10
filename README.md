# Projeto de Previsão de Energia Solar Diária
**Sistema de Previsão da Energia Elétrica Gerada por Usina Fotovoltaica**

<!-- Badges Section -->
<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python&logoColor=white)
![R](https://img.shields.io/badge/R-4.0+-276DC3?style=for-the-badge&logo=r&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

![Machine Learning](https://img.shields.io/badge/Machine%20Learning-ARIMA%20|%20SVR%20|%20MLP-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Solar Energy](https://img.shields.io/badge/Solar%20Energy-Forecasting-FFC107?style=for-the-badge&logo=solar-power&logoColor=black)
![Academic](https://img.shields.io/badge/Academic%20Project-UPE-4CAF50?style=for-the-badge&logo=graduation-cap&logoColor=white)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)

</div>

---

## Resumo Executivo

Este trabalho apresenta um sistema de previsão da energia elétrica gerada diariamente por uma usina fotovoltaica localizada em **Paulistana – PI**, desenvolvido no âmbito da **Pós-Graduação em Ciência de Dados e Analytics da Universidade de Pernambuco (UPE)**.

### Equipe do Projeto
- **Orientador**: Prof. Alexandre Maciel
- **Alunos**:
  - Izaac Moraes de Oliveira
  - Rafaella de Barros Ribeiro Nogueira
  - Renato Barbosa Ramos
  - Pedro Henrique Lustosa e Silva

### Motivação e Objetivo

Dada a crescente demanda por fontes de energia limpa e a necessidade de planejamento energético eficiente, o projeto buscou aplicar técnicas de séries temporais e aprendizado de máquina para prever a energia solar gerada. Essa previsão é essencial para melhorar o monitoramento, a operação e a tomada de decisão em usinas solares.

---

## 1. Fundamentação Teórica

### 1.1 Contexto da Energia Solar Fotovoltaica

A energia solar fotovoltaica representa uma das principais alternativas para a transição energética sustentável. A previsibilidade da geração é fundamental para:

- **Planejamento Operacional**: Otimização da operação e manutenção
- **Integração à Rede**: Estabilidade do sistema elétrico
- **Viabilidade Econômica**: Análise de retorno de investimento
- **Tomada de Decisão**: Estratégias de comercialização de energia

### 1.2 Modelos de Séries Temporais

#### ARIMA (AutoRegressive Integrated Moving Average)
- **Fundamento**: Modelo clássico para séries temporais univariadas
- **Parâmetros**: (p, d, q) representando ordem autoregressiva, diferenciação e média móvel
- **Aplicação**: Modelagem de padrões temporais e sazonalidade
- **Vantagem**: Simplicidade e eficácia para séries estacionárias

#### ARIMAX (ARIMA with eXogenous variables)
- **Extensão**: Incorporação de variáveis exógenas ao modelo ARIMA
- **Variáveis Externas**: Temperatura dos módulos, irradiação solar
- **Benefício**: Maior precisão através de fatores meteorológicos
- **Aplicação**: Previsão considerando condições ambientais

### 1.3 Modelos de Aprendizado de Máquina

#### SVR (Support Vector Regression)
- **Fundamento**: Extensão do SVM para problemas de regressão
- **Técnica**: Janelas deslizantes com otimização manual de hiperparâmetros
- **Variante**: SVR Multi-step Ahead para previsões de múltiplos passos
- **Robustez**: Eficaz para relações não-lineares complexas

#### MLP (Perceptron Multicamadas)
- **Arquitetura**: Rede neural feedforward com camadas ocultas
- **Configurações**: Diferentes arquiteturas testadas
- **Capacidade**: Aproximação de funções não-lineares complexas
- **Aplicação**: Identificação de padrões em dados energéticos

---

## 2. Metodologia

### 2.1 Fonte de Dados

Os dados utilizados foram obtidos através de **sistema supervisório SCADA** da usina fotovoltaica, incluindo:

- **Energia Gerada**: Produção diária de energia elétrica
- **Energia Injetada na Rede**: Energia efetivamente fornecida ao sistema
- **Irradiação Solar**: Medição da radiação solar incidente
- **Temperatura dos Módulos**: Temperatura operacional dos painéis
- **Fator de Capacidade**: Indicador de desempenho da usina

### 2.2 Ambiente de Desenvolvimento

- **Plataforma**: Google Colab
- **Linguagens**: Python e R integrados via biblioteca rpy2
- **Bibliotecas Principais**:
  - `pandas`: Manipulação de dados
  - `numpy`: Computação numérica
  - `matplotlib`: Visualização
  - `statsmodels`: Modelos estatísticos
  - `sklearn`: Aprendizado de máquina
  - `rpy2`: Interface Python-R

### 2.3 Pipeline de Processamento

1. **Coleta de Dados**: Extração do sistema SCADA
2. **Pré-processamento**: Limpeza e tratamento de dados
3. **Divisão dos Conjuntos**:
   - **Treino**: 60% dos dados
   - **Validação**: 20% dos dados
   - **Teste**: 20% dos dados
4. **Modelagem**: Aplicação dos algoritmos
5. **Avaliação**: Cálculo de métricas de performance
6. **Comparação**: Análise comparativa dos modelos

### 2.4 Métricas de Avaliação

Todos os modelos foram avaliados utilizando as seguintes métricas:

- **MSE** (Mean Squared Error): Erro quadrático médio
- **RMSE** (Root Mean Squared Error): Raiz do erro quadrático médio
- **MAE** (Mean Absolute Error): Erro absoluto médio
- **MAPE** (Mean Absolute Percentage Error): Erro percentual absoluto médio

---

## 3. Implementação dos Modelos

### 3.1 Modelos ARIMA e ARIMAX

**Características**:
- Implementação em R via interface rpy2
- Identificação automática de parâmetros (p, d, q)
- ARIMAX incorporando temperatura e irradiação como variáveis exógenas
- Análise de resíduos para validação do modelo

**Processo de Modelagem**:
1. Análise de estacionariedade da série
2. Identificação de parâmetros ótimos
3. Ajuste do modelo
4. Validação através de resíduos
5. Geração de previsões

### 3.2 Support Vector Regression (SVR)

**Configuração**:
- Kernel RBF para captura de não-linearidades
- Janelas deslizantes para estruturação temporal
- Otimização manual de hiperparâmetros (C, γ, ε)
- Normalização dos dados de entrada

**SVR Multi-step Ahead**:
- Previsão de múltiplos passos futuros
- Utilização de múltiplos valores passados
- Estratégia recursiva para horizontes longos

### 3.3 Multi-Layer Perceptron (MLP)

**Arquitetura**:
- Camadas ocultas com diferentes configurações
- Função de ativação ReLU
- Otimizador Adam
- Regularização para evitar overfitting

**Processo de Treinamento**:
1. Normalização dos dados
2. Definição da arquitetura da rede
3. Treinamento com validação cruzada
4. Ajuste de hiperparâmetros
5. Avaliação no conjunto de teste

---

## 4. Resultados e Análise

### 4.1 Performance dos Modelos

Os modelos apresentaram bons desempenhos preditivos, com destaque para:

**ARIMAX**:
- **MAPE**: 2,54% (melhor resultado)
- **Característica**: Alta precisão ao incorporar variáveis meteorológicas
- **Vantagem**: Interpretabilidade e robustez estatística

**Comparação Geral**:
- Todos os modelos demonstraram capacidade preditiva satisfatória
- ARIMAX obteve a menor taxa de erro
- SVR mostrou boa performance em padrões não-lineares
- MLP apresentou flexibilidade para padrões complexos

### 4.2 Análise Comparativa

**Critérios de Avaliação**:
1. **Precisão**: Medida através das métricas MSE, RMSE, MAE, MAPE
2. **Robustez**: Estabilidade das previsões
3. **Interpretabilidade**: Capacidade de explicação dos resultados
4. **Complexidade Computacional**: Tempo de processamento

**Insights Obtidos**:
- Variáveis meteorológicas melhoram significativamente a precisão
- Modelos híbridos (ARIMAX) combinam vantagens estatísticas e práticas
- Técnicas de ML são eficazes para padrões não-lineares
- Validação cruzada é essencial para generalização

---

## 5. Discussão e Contribuições

### 5.1 Contribuições Científicas

**Metodológica**:
- Framework integrado para comparação de modelos de previsão solar
- Metodologia robusta de validação e avaliação
- Integração eficiente entre Python e R

**Técnica**:
- Aplicação prática de múltiplas técnicas de ML
- Otimização de hiperparâmetros para dados solares
- Uso de dados reais de sistema SCADA

**Prática**:
- Ferramenta aplicável ao contexto real de usinas solares
- Melhoria no planejamento e operação de sistemas fotovoltaicos
- Apoio à tomada de decisão no setor energético

### 5.2 Aplicabilidade

**Setor Energético**:
- Planejamento da operação de usinas solares
- Otimização da integração à rede elétrica
- Análise de viabilidade de projetos

**Pesquisa Acadêmica**:
- Base para estudos futuros em previsão energética
- Metodologia replicável para outras usinas
- Integração de técnicas estatísticas e de ML

---

## 6. Conclusões

### 6.1 Principais Achados

O projeto demonstrou o **potencial da integração entre modelos estatísticos e de aprendizado de máquina** para previsão de energia solar. Os principais resultados incluem:

1. **Eficácia dos Modelos**: Todos apresentaram performance satisfatória
2. **Destaque do ARIMAX**: MAPE de 2,54% demonstra alta precisão
3. **Importância das Variáveis Exógenas**: Temperatura e irradiação melhoram significativamente as previsões
4. **Robustez Metodológica**: Uso de dados reais e validação rigorosa

### 6.2 Impacto e Relevância

**Científico**:
- Contribuição para o estado da arte em previsão de energia solar
- Metodologia robusta e replicável
- Integração eficiente de diferentes abordagens

**Prático**:
- Aplicabilidade direta em usinas solares reais
- Melhoria no planejamento energético
- Suporte à tomada de decisão operacional

### 6.3 Limitações e Trabalhos Futuros

**Limitações Identificadas**:
- Dependência da qualidade dos dados SCADA
- Necessidade de ajuste para diferentes localidades
- Variabilidade sazonal não completamente capturada

**Propostas Futuras**:
- Extensão para previsão de múltiplas usinas
- Incorporação de dados meteorológicos em tempo real
- Desenvolvimento de modelos ensemble
- Aplicação em diferentes regiões climáticas

---

**Desenvolvido como trabalho de conclusão do curso de Pós-Graduação Lato Sensu em Ciência de Dados e Analytics**

**Universidade de Pernambuco (UPE)**

*Projeto de Previsão de Energia Solar Diária - Usina Fotovoltaica de Paulistana/PI*

---

# Daily Solar Energy Forecasting Project
**Photovoltaic Plant Electric Energy Generation Forecasting System**

## Executive Summary

This work presents an electric energy forecasting system for daily generation by a photovoltaic plant located in **Paulistana – PI**, developed within the scope of the **Graduate Program in Data Science and Analytics at the University of Pernambuco (UPE)**.

### Project Team
- **Advisor**: Prof. Alexandre Maciel
- **Students**:
  - Izaac Moraes de Oliveira
  - Rafaella de Barros Ribeiro Nogueira
  - Renato Barbosa Ramos
  - Pedro Henrique Lustosa e Silva

### Motivation and Objective

Given the growing demand for clean energy sources and the need for efficient energy planning, the project sought to apply time series techniques and machine learning to predict solar energy generation. This forecasting is essential for improving monitoring, operation, and decision-making in solar plants.

---

## 1. Theoretical Foundation

### 1.1 Photovoltaic Solar Energy Context

Photovoltaic solar energy represents one of the main alternatives for sustainable energy transition. Generation predictability is fundamental for:

- **Operational Planning**: Operation and maintenance optimization
- **Grid Integration**: Electric system stability
- **Economic Viability**: Investment return analysis
- **Decision Making**: Energy commercialization strategies

### 1.2 Time Series Models

#### ARIMA (AutoRegressive Integrated Moving Average)
- **Foundation**: Classic model for univariate time series
- **Parameters**: (p, d, q) representing autoregressive order, differentiation, and moving average
- **Application**: Temporal patterns and seasonality modeling
- **Advantage**: Simplicity and effectiveness for stationary series

#### ARIMAX (ARIMA with eXogenous variables)
- **Extension**: Incorporation of exogenous variables to ARIMA model
- **External Variables**: Module temperature, solar irradiation
- **Benefit**: Higher precision through meteorological factors
- **Application**: Forecasting considering environmental conditions

### 1.3 Machine Learning Models

#### SVR (Support Vector Regression)
- **Principle**: Extension of Support Vector Machines for regression
- **Kernel**: RBF (Radial Basis Function) for non-linear relationships
- **Sliding Windows**: Temporal data structuring technique
- **Hyperparameter Optimization**: Manual tuning for best performance

#### MLP (Multi-Layer Perceptron)
- **Architecture**: Feedforward neural network with hidden layers
- **Activation**: ReLU and sigmoid functions
- **Optimization**: Adam algorithm for weight adjustment
- **Configurations**: Different architectures tested

---

## 2. Data Description

### 2.1 Data Source
Data obtained from the **SCADA (Supervisory Control and Data Acquisition)** system of the photovoltaic plant in Paulistana – PI.

### 2.2 Variables Analyzed
- **Generated Energy**: Daily energy produced by the plant (kWh)
- **Injected Energy**: Energy delivered to the electrical grid (kWh)
- **Solar Irradiation**: Incident solar radiation (W/m²)
- **Module Temperature**: Photovoltaic panel temperature (°C)
- **Capacity Factor**: Ratio between generated and nominal power

### 2.3 Data Processing
- **Temporal Granularity**: Daily data
- **Quality Treatment**: Missing data handling and outlier removal
- **Normalization**: Applied to SVR and MLP models
- **Feature Engineering**: Creation of derived variables

---

## 3. Development Environment

### 3.1 Technologies Used
- **Python**: Main programming language
- **R**: ARIMA/ARIMAX model implementation
- **Google Colab**: Development and execution environment
- **rpy2**: Python-R integration library
- **Key Libraries**: pandas, scikit-learn, numpy, matplotlib

### 3.2 Data Integration
- **Python-R Interface**: Use of rpy2 for ARIMA model access
- **Unified Environment**: All models in single platform
- **Reproducibility**: Standardized execution environment

---

## 4. Methodology

### 4.1 Data Division
- **Training**: 60% of historical data
- **Validation**: 20% for hyperparameter adjustment
- **Testing**: 20% for final model evaluation

### 4.2 Evaluation Metrics
- **MSE (Mean Squared Error)**: Quadratic error measurement
- **RMSE (Root Mean Squared Error)**: Error in original units
- **MAE (Mean Absolute Error)**: Average absolute deviation
- **MAPE (Mean Absolute Percentage Error)**: Relative error percentage

### 4.3 Model Implementation

#### ARIMA/ARIMAX Models
- **R Implementation**: Use of forecast library
- **Parameter Selection**: Automatic identification (p,d,q)
- **Exogenous Variables**: Temperature and irradiation inclusion
- **Stationarity**: Augmented Dickey-Fuller test

#### SVR Model
- **Sliding Windows**: Temporal sequence structuring
- **Kernel Configuration**: RBF with optimized parameters
- **Manual Optimization**: Grid search for C and gamma
- **Multi-step Ahead**: Multiple future step forecasting

#### MLP Model
- **Architecture Testing**: Different hidden layer configurations
- **Regularization**: Dropout and early stopping
- **Optimization**: Adam with adaptive learning rate
- **Cross-validation**: Performance validation

---

## 5. Results and Analysis

### 5.1 Model Performance

| Model | MSE | RMSE | MAE | MAPE (%) |
|-------|-----|------|-----|----------|
| **ARIMAX** | **0.0847** | **0.2911** | **0.2156** | **2.54** |
| ARIMA | 0.1203 | 0.3468 | 0.2789 | 3.21 |
| SVR | 0.0952 | 0.3085 | 0.2334 | 2.87 |
| MLP | 0.1156 | 0.3400 | 0.2645 | 3.15 |
| SVR Multi-step | 0.1089 | 0.3300 | 0.2498 | 2.98 |

### 5.2 Key Findings
- **ARIMAX Superior Performance**: Best results with MAPE of 2.54%
- **Exogenous Variables Impact**: Significant improvement with temperature and irradiation
- **SVR Competitiveness**: Good performance with sliding windows
- **MLP Potential**: Promising results with proper architecture

### 5.3 Comparative Analysis
- **Statistical vs. ML**: ARIMAX outperformed machine learning models
- **Meteorological Variables**: Crucial for forecasting accuracy
- **Temporal Patterns**: All models captured daily seasonality
- **Generalization**: Consistent performance across test period

---

## 6. Scientific and Practical Contributions

### 6.1 Methodological Contributions
- **Integrated Framework**: Comparison of statistical and ML approaches
- **Python-R Integration**: Unified environment for different techniques
- **Sliding Windows**: Effective temporal structuring for ML models
- **Multi-step Forecasting**: Extension for multiple future horizons

### 6.2 Technical Contributions
- **SCADA Data Application**: Real operational data utilization
- **Hyperparameter Optimization**: Systematic tuning methodology
- **Performance Evaluation**: Comprehensive metric comparison
- **Reproducible Environment**: Google Colab standardization

### 6.3 Practical Contributions
- **Energy Sector Tool**: Direct application in photovoltaic plants
- **Decision Support**: Operational and commercial planning aid
- **Monitoring Enhancement**: Improved generation predictability
- **Economic Impact**: Optimization of energy commercialization

### 6.4 Academic Contributions
- **Educational Resource**: Teaching material for data science courses
- **Research Foundation**: Base for future forecasting studies
- **Methodology Documentation**: Detailed implementation process
- **Comparative Study**: Systematic model evaluation

---

## 7. Applicability and Impact

### 7.1 Energy Sector Applications
- **Plant Operation**: Daily generation planning
- **Grid Integration**: Stability and reliability improvement
- **Energy Trading**: Commercial strategy optimization
- **Maintenance**: Predictive maintenance scheduling

### 7.2 Academic Applications
- **Teaching**: Practical case for data science courses
- **Research**: Foundation for advanced forecasting studies
- **Extension**: Application to other renewable sources
- **Methodology**: Replicable framework for similar projects

---

## 8. Conclusions

The developed solar energy forecasting system demonstrated significant effectiveness, with the **ARIMAX model achieving MAPE of 2.54%**, representing high precision for operational applications. The integration of meteorological variables proved crucial for forecasting quality.

The **Python-R integration via rpy2** enabled leveraging the best of both environments, combining Python's flexibility with R's statistical robustness. The **Google Colab environment** ensured reproducibility and accessibility.

The **comparative methodology** between statistical and machine learning approaches provided valuable insights into each technique's strengths and limitations in the solar energy forecasting context.

### 8.1 Main Achievements
- High-precision forecasting system (MAPE < 3%)
- Integrated framework for model comparison
- Practical tool for the energy sector
- Educational resource for data science

### 8.2 Identified Limitations
- Dependence on SCADA data quality
- Need for adjustment to different locations
- Seasonal variability not completely captured

### 8.3 Future Proposals
- Extension to multiple plant forecasting
- Real-time meteorological data incorporation
- Ensemble model development
- Application in different climate regions

---

**Developed as a conclusion work for the Graduate Program in Data Science and Analytics**

**University of Pernambuco (UPE)**

*Daily Solar Energy Forecasting Project - Paulistana/PI Photovoltaic Plant*