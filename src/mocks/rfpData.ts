import { RFPQueryResult } from '../services/api';

const S3_BUCKET_URL = import.meta.env.VITE_S3_BUCKET_URL;

export const mockResults: RFPQueryResult[] = [
  {
    content: `# Data Security & Privacy

Your data is safeguarded with the highest standards of security and privacy. We maintain stringent information security management systems and undergo regular SOC2 audits to verify that our controls and processes meet the rigorous criteria for security, availability, processing integrity, confidentiality and privacy. We can provide an SOC2 report upon request.

## Our multi-layered security approach includes:

Title: Security Approach
The image shows an icon representing advanced encryption technologies, which is part of the multi-layered security approach described in the surrounding text.

Advanced encryption technologies

Title: Advanced encryption technologies and regular penetration testing
The image appears to be an icon or logo representing advanced encryption technologies and regular penetration testing, as indicated by the accompanying text.

Regular penetration testing

Title: Regular Penetration Testing and Access Controls
The image depicts an icon representing a person, likely an employee or user, along with text describing regular penetration testing and rigorous access controls and employee training programs to foster a culture of security awareness and responsibility among employees.

Rigorous access controls and employee training programs to foster a culture of security awareness and responsibility among employees`,
    source: `${S3_BUCKET_URL}/Security_Standards_2024.pdf`,
    score: 0.95,
  },
  {
    content: `# Cloud Infrastructure

Our solution is built on a robust cloud infrastructure leveraging AWS's global network of data centers. This ensures:

## High Availability
- 99.99% uptime guarantee
- Multi-region deployment
- Automatic failover mechanisms

## Scalability
- Auto-scaling capabilities
- Load balancing across regions
- Elastic resource allocation

## Disaster Recovery
Title: Disaster Recovery Overview
- Regular backups
- Cross-region replication
- 15-minute RPO (Recovery Point Objective)
- 1-hour RTO (Recovery Time Objective)`,
    source: `${S3_BUCKET_URL}/Cloud_Infrastructure_Overview.pdf`,
    score: 0.89,
  },
  {
    content: `# Implementation Timeline

## Phase 1: Initial Setup (Weeks 1-2)
- Project kickoff
- Requirements gathering
- Environment setup
- Initial configuration

## Phase 2: Core Implementation (Weeks 3-6)
- Data migration
- System integration
- User setup
- Initial testing

## Phase 3: Testing & Training (Weeks 7-8)
- User acceptance testing
- Staff training
- Documentation
- Performance optimization

## Phase 4: Launch & Support (Weeks 9-10)
- Go-live preparation
- Production deployment
- Post-launch support
- Monitoring and optimization`,
    source: `${S3_BUCKET_URL}/Implementation_Plan_2024.pdf`,
    score: 0.82,
  },
];

export const generateMockResults = (query: string): RFPQueryResult[] => {
  // Simulate relevance based on query matching
  return mockResults
    .map((result) => ({
      ...result,
      score: result.content.toLowerCase().includes(query.toLowerCase())
        ? Math.random() * 0.3 + 0.7 // Random score between 0.7 and 1.0 for matching content
        : Math.random() * 0.3 + 0.4, // Random score between 0.4 and 0.7 for non-matching content
    }))
    .sort((a, b) => b.score - a.score); // Sort by score descending
};
