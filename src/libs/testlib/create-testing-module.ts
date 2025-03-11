import { CanActivate, ExecutionContext, Injectable, ModuleMetadata, Type } from '@nestjs/common'
import { Test } from '@nestjs/testing'

export interface ModuleMetadataEx extends ModuleMetadata {
    /**
     * 테스트 중 무시할 가드 목록
     * @example [AuthGuard, RoleGuard]
     */
    ignoreGuards?: Type<CanActivate>[]

    /**
     * 테스트 중 무시할 프로바이더 목록
     * @example [AuthService, RoleService]
     */
    ignoreProviders?: Type<any>[]

    /**
     * 특정 프로바이더를 다른 값으로 오버라이드하기 위한 원본과 대체값 쌍
     * @example [{ original: AuthService, replacement: MockAuthService }]
     */
    overrideProviders?: { original: Type<any>; replacement: any }[]
}

class NullGuard implements CanActivate {
    canActivate(_context: ExecutionContext): boolean {
        return true
    }
}

@Injectable()
class NullProvider {}

export async function createTestingModule(metadataEx: ModuleMetadataEx) {
    const { ignoreGuards, ignoreProviders, overrideProviders, ...metadata } = metadataEx
    const builder = Test.createTestingModule(metadata)

    ignoreGuards?.forEach((guard) => {
        builder.overrideGuard(guard).useClass(NullGuard)
    })

    ignoreProviders?.forEach((provider) => {
        builder.overrideProvider(provider).useClass(NullProvider)
    })

    overrideProviders?.forEach(({ original, replacement }) => {
        builder.overrideProvider(original).useValue(replacement)
    })

    const module = await builder.compile()
    return module
}
