import { RFPQueryResult } from './api';
import { Id } from '../../convex/_generated/dataModel';

// Helper to create mock IDs
const createMockId = (
  table: 'responses' | 'queries',
  index: number
): Id<any> => {
  return `mock_${table}_${index}` as Id<any>;
};

const MOCK_DELAY = 1000; // 1 second delay to simulate API call

const MOCK_RESPONSES: RFPQueryResult[] = [
  {
    _id: createMockId('responses', 1),
    queryId: createMockId('queries', 1),
    content: `# Technical Requirements

Our solution must meet the following technical specifications:

- Cloud-native architecture using microservices
- Containerized deployment with Kubernetes
- High availability with 99.9% uptime
- Automated CI/CD pipeline
- Real-time data processing capabilities
- Scalable to handle 10,000+ concurrent users

## Infrastructure Requirements
- AWS or Azure cloud platform
- Multi-region deployment
- Auto-scaling configuration
- Load balancing with failover
- Disaster recovery plan
- Backup and retention policies

## Development Standards
- TypeScript for frontend and backend
- React for user interfaces
- Node.js for backend services
- GraphQL API architecture
- Comprehensive test coverage
- Automated documentation

The system should be built using modern technologies and follow industry best practices for security and performance.`,
    source: 'https://example.com/technical-requirements.pdf',
    score: 0.92,
    metadata: {
      category: 'Technical',
      relevanceScore: 0.92,
      tags: ['infrastructure', 'development', 'cloud', 'security'],
    },
  },
  {
    _id: createMockId('responses', 2),
    queryId: createMockId('queries', 1),
    content: `# Security Requirements

The security implementation must include:

- End-to-end encryption for all data in transit
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Regular security audits and penetration testing
- Compliance with GDPR, HIPAA, and SOC 2
- Automated vulnerability scanning

## Access Control
- Single Sign-On (SSO) integration
- OAuth 2.0 and OpenID Connect support
- IP whitelisting capabilities
- Session management and timeout
- Audit logging of all access attempts

## Data Protection
- AES-256 encryption for data at rest
- TLS 1.3 for data in transit
- Regular backup encryption
- Secure key management
- Data anonymization for testing

## Compliance Requirements
- Annual SOC 2 Type II audit
- Quarterly penetration testing
- Monthly vulnerability assessments
- GDPR compliance documentation
- HIPAA security controls
- PCI DSS compliance measures

All security measures must be documented and regularly reviewed.`,
    source: 'https://example.com/security-specs.pdf',
    score: 0.87,
    metadata: {
      category: 'Security',
      relevanceScore: 0.87,
      tags: ['security', 'compliance', 'encryption', 'access-control'],
    },
  },
  {
    _id: createMockId('responses', 3),
    queryId: createMockId('queries', 1),
    content: `# Pricing Structure

Our pricing model includes:

## License Costs
- Base platform license: $50,000/year
- Per-user pricing: $100/user/month
- Enterprise support package: $10,000/month
- Implementation services: $150/hour
- Custom development: $200/hour
- Training and documentation: $5,000/package

## Support Tiers
### Standard Support
- Business hours support
- Email and ticket support
- 24-hour response time
- Basic training materials

### Premium Support
- 24/7 support coverage
- Phone and video support
- 4-hour response time
- Advanced training sessions
- Dedicated support manager

### Enterprise Support
- 24/7 priority support
- 1-hour response time
- On-site support options
- Custom training programs
- Dedicated account team

## Additional Services
- Custom integration development
- Data migration services
- Performance optimization
- Security hardening
- Compliance documentation

Volume discounts available for organizations with 1000+ users.
Multi-year contracts include additional 10% discount.`,
    source: 'https://example.com/pricing.pdf',
    score: 0.75,
    metadata: {
      category: 'Pricing',
      relevanceScore: 0.75,
      tags: ['pricing', 'licensing', 'support', 'services'],
    },
  },
  {
    _id: createMockId('responses', 4),
    queryId: createMockId('queries', 1),
    content: `# Implementation Timeline

Project phases and deliverables:

## Phase 1: Initial Setup (Weeks 1-4)
### Week 1-2: Project Initiation
- Project kickoff meeting
- Requirements validation
- Environment setup
- Team onboarding
- Initial architecture review

### Week 3-4: Foundation Setup
- Infrastructure provisioning
- Core system configuration
- Basic user management
- Development pipeline setup
- Initial security controls

## Phase 2: Core Features (Weeks 5-12)
### Week 5-8: Primary Development
- Main functionality development
- Database implementation
- API development
- Frontend components
- Basic integration testing

### Week 9-12: Integration
- Third-party integrations
- Authentication implementation
- Advanced features development
- Initial system testing
- Performance optimization

## Phase 3: Testing & Optimization (Weeks 13-16)
### Week 13-14: Testing
- User acceptance testing
- Performance testing
- Security testing
- Integration testing
- Bug fixes and refinements

### Week 15-16: Optimization
- Performance optimization
- Security hardening
- Documentation updates
- Training material preparation
- Pre-launch validation

## Phase 4: Deployment (Weeks 17-20)
### Week 17-18: Preparation
- Production environment setup
- Data migration
- Final security audit
- Disaster recovery testing
- Documentation finalization

### Week 19-20: Launch
- Production deployment
- User training sessions
- Go-live support
- Post-deployment monitoring
- Handover to support team`,
    source: 'https://example.com/implementation-plan.pdf',
    score: 0.82,
    metadata: {
      category: 'Implementation',
      relevanceScore: 0.82,
      tags: ['timeline', 'project-management', 'deployment', 'training'],
    },
  },
  {
    _id: createMockId('responses', 5),
    queryId: createMockId('queries', 1),
    content: `# Support and Maintenance

## Support Services
### 24/7 Technical Support
- Dedicated support team
- Multiple communication channels
- Guaranteed response times
- Issue tracking and reporting
- Regular status updates

### Preventive Maintenance
- System health monitoring
- Performance optimization
- Security updates
- Backup verification
- Capacity planning

## Service Level Agreement (SLA)
### Response Times
- Critical issues: 15 minutes
- High priority: 1 hour
- Medium priority: 4 hours
- Low priority: 24 hours

### System Availability
- 99.99% uptime guarantee
- Planned maintenance windows
- Automatic failover
- Load balancing
- Disaster recovery

## Ongoing Support Activities
- Monthly system reviews
- Quarterly performance reports
- Regular security assessments
- User training sessions
- Documentation updates

## Incident Management
- 24/7 incident response
- Root cause analysis
- Incident documentation
- Prevention measures
- Status communication`,
    source: 'https://example.com/support-sla.pdf',
    score: 0.78,
    metadata: {
      category: 'Support',
      relevanceScore: 0.78,
      tags: ['support', 'maintenance', 'sla', 'monitoring'],
    },
  },
];

export const searchMockRFP = async (
  query: string
): Promise<RFPQueryResult[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // Simple search implementation - in reality would be more sophisticated
  const searchTerms = query.toLowerCase().split(' ');

  return MOCK_RESPONSES.filter((response) => {
    const content = response.content.toLowerCase();
    return searchTerms.some((term) => content.includes(term));
  }).map((response) => ({
    ...response,
    // Adjust score based on number of matching terms
    score:
      response.score *
      (searchTerms.filter((term) =>
        response.content.toLowerCase().includes(term)
      ).length /
        searchTerms.length),
  }));
};
